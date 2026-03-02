"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Summary = {
  range_days: number;
  unique_visitors: number;
  total_page_views: number;
  total_sessions: number;
  returning_visitors: number;
  total_classes: number;
  total_subjects: number;
  total_lessons: number;
  total_categories: number;
  contact_requests: number;
  avg_session_depth: number;
};

type TopPage = { path: string; visits: number };
type DailyActivity = { day: string; visits: number; visitors: number };
type EventBreakdown = { event_type: string; total: number };
type TopLesson = {
  title: string;
  slug: string;
  subject__title: string;
  subject__school_class__title: string;
  subject__category__title: string;
  views: number;
};

type DashboardPayload = {
  summary: Summary;
  top_pages: TopPage[];
  daily_activity: DailyActivity[];
  event_breakdown: EventBreakdown[];
  high_demand_topics: { label: string; total: number }[];
  top_lessons: TopLesson[];
  class_popularity: { label: string; total: number }[];
};

type Category = {
  id: number;
  title: string;
  slug: string;
  description: string;
  color: string;
  icon_url: string;
  order: number;
  is_active: boolean;
};

type SchoolClass = {
  id: number;
  title: string;
  slug: string;
  description: string;
  order: number;
  is_active: boolean;
  hero_image_url: string;
  cover_image_url: string;
  external_link: string;
};

type Subject = {
  id: number;
  school_class: number;
  category: number | null;
  class_id: string;
  title: string;
  slug: string;
  color: string;
  description: string;
  order: number;
  is_active: boolean;
  thumbnail_url: string;
  external_link: string;
};

type Lesson = {
  id: number;
  subject: number;
  title: string;
  slug: string;
  youtube_id: string;
  description: string;
  short_description: string;
  duration_seconds: number;
  order: number;
  is_published: boolean;
  views_count: number;
  thumbnail_url: string;
  resource_url: string;
  external_link: string;
};

type ContactRequest = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  telegram: string;
  source: string;
  status: "new" | "in_progress" | "resolved" | "spam";
  message: string;
  created_at: string;
};

type LoginResponse = {
  token: string;
  user: { username: string; is_staff: boolean };
};

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://127.0.0.1:8000/api/v1";
const TOKEN_KEY = "scholar_admin_token";

type Tab = "categories" | "classes" | "subjects" | "lessons" | "contacts";

export default function AdminPanelPage() {
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("categories");

  const [dashboard, setDashboard] = useState<DashboardPayload | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);

  const [days, setDays] = useState(30);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  const [categoryForm, setCategoryForm] = useState({ id: 0, title: "", color: "", description: "", icon_url: "", order: 1, is_active: true });
  const [classForm, setClassForm] = useState({ id: 0, title: "", description: "", order: 1, is_active: true, hero_image_url: "", cover_image_url: "", external_link: "" });
  const [subjectForm, setSubjectForm] = useState({ id: 0, school_class: 0, category: 0, title: "", color: "", description: "", order: 1, is_active: true, thumbnail_url: "", external_link: "" });
  const [lessonForm, setLessonForm] = useState({ id: 0, subject: 0, title: "", youtube_id: "", description: "", short_description: "", duration_seconds: 0, order: 1, is_published: true, thumbnail_url: "", resource_url: "", external_link: "" });

  useEffect(() => {
    const saved = window.localStorage.getItem(TOKEN_KEY);
    if (saved) setToken(saved);
  }, []);

  useEffect(() => {
    if (!token) return;
    void loadAll(token);
  }, [token, days, filterCategory, filterClass, filterSubject]);

  const dailyChart = useMemo(() => {
    const points = dashboard?.daily_activity || [];
    const max = Math.max(...points.map((p) => p.visits), 1);
    return points.slice(-14).map((p) => ({ ...p, percent: Math.round((p.visits / max) * 100) }));
  }, [dashboard]);

  async function api<T>(path: string, init?: RequestInit, authToken?: string): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Token ${authToken}` } : {}),
        ...(init?.headers || {}),
      },
    });

    if (res.status === 204) return {} as T;
    if (!res.ok) {
      const detail = await res.text();
      throw new Error(detail || `API error ${res.status}`);
    }
    return (await res.json()) as T;
  }

  function dashboardQuery() {
    const params = new URLSearchParams();
    params.set("days", String(days));
    if (filterCategory) params.set("category", filterCategory);
    if (filterClass) params.set("class", filterClass);
    if (filterSubject) params.set("subject", filterSubject);
    return params.toString();
  }

  async function loadAll(authToken: string) {
    setLoading(true);
    setError("");
    try {
      const [dashboardRes, categoryRes, classRes, subjectRes, lessonRes, contactRes] = await Promise.all([
        api<DashboardPayload>(`/analytics/dashboard/?${dashboardQuery()}`, undefined, authToken),
        api<{ results: Category[] } | Category[]>("/categories/?ordering=order", undefined, authToken),
        api<{ results: SchoolClass[] } | SchoolClass[]>("/classes/?ordering=order", undefined, authToken),
        api<{ results: Subject[] } | Subject[]>("/subjects/?ordering=order", undefined, authToken),
        api<{ results: Lesson[] } | Lesson[]>("/lessons/?ordering=order", undefined, authToken),
        api<{ results: ContactRequest[] } | ContactRequest[]>("/contact-requests/?ordering=-created_at", undefined, authToken),
      ]);

      setDashboard(dashboardRes);
      setCategories(normalizeList(categoryRes));
      setClasses(normalizeList(classRes));
      setSubjects(normalizeList(subjectRes));
      setLessons(normalizeList(lessonRes));
      setContacts(normalizeList(contactRes));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xatolik");
    } finally {
      setLoading(false);
    }
  }

  async function loginAdmin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api<LoginResponse>("/auth/admin-login/", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      setToken(res.token);
      window.localStorage.setItem(TOKEN_KEY, res.token);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login xatosi");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken("");
    setDashboard(null);
    window.localStorage.removeItem(TOKEN_KEY);
  }

  async function exportCsv(type: "events" | "top_pages") {
    if (!token) return;
    const res = await fetch(`${API_BASE}/analytics/export/?type=${type}&days=${days}`, {
      headers: { Authorization: `Token ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics_${type}_${days}d.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function submitCategory(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    const payload = {
      title: categoryForm.title,
      color: categoryForm.color,
      description: categoryForm.description,
      icon_url: categoryForm.icon_url,
      order: categoryForm.order,
      is_active: categoryForm.is_active,
    };
    if (categoryForm.id) {
      await api(`/categories/${categoryForm.id}/`, { method: "PATCH", body: JSON.stringify(payload) }, token);
    } else {
      await api("/categories/", { method: "POST", body: JSON.stringify(payload) }, token);
    }
    setCategoryForm({ id: 0, title: "", color: "", description: "", icon_url: "", order: 1, is_active: true });
    await loadAll(token);
  }

  async function submitClass(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    const payload = {
      title: classForm.title,
      description: classForm.description,
      order: classForm.order,
      is_active: classForm.is_active,
      hero_image_url: classForm.hero_image_url,
      cover_image_url: classForm.cover_image_url,
      external_link: classForm.external_link,
    };
    if (classForm.id) {
      await api(`/classes/${classForm.id}/`, { method: "PATCH", body: JSON.stringify(payload) }, token);
    } else {
      await api("/classes/", { method: "POST", body: JSON.stringify(payload) }, token);
    }
    setClassForm({ id: 0, title: "", description: "", order: 1, is_active: true, hero_image_url: "", cover_image_url: "", external_link: "" });
    await loadAll(token);
  }

  async function submitSubject(e: FormEvent) {
    e.preventDefault();
    if (!token || !subjectForm.school_class) return;
    const payload = {
      school_class: subjectForm.school_class,
      category: subjectForm.category || null,
      title: subjectForm.title,
      color: subjectForm.color,
      description: subjectForm.description,
      order: subjectForm.order,
      is_active: subjectForm.is_active,
      thumbnail_url: subjectForm.thumbnail_url,
      external_link: subjectForm.external_link,
    };
    if (subjectForm.id) {
      await api(`/subjects/${subjectForm.id}/`, { method: "PATCH", body: JSON.stringify(payload) }, token);
    } else {
      await api("/subjects/", { method: "POST", body: JSON.stringify(payload) }, token);
    }
    setSubjectForm({ id: 0, school_class: 0, category: 0, title: "", color: "", description: "", order: 1, is_active: true, thumbnail_url: "", external_link: "" });
    await loadAll(token);
  }

  async function submitLesson(e: FormEvent) {
    e.preventDefault();
    if (!token || !lessonForm.subject) return;
    const payload = {
      subject: lessonForm.subject,
      title: lessonForm.title,
      youtube_id: lessonForm.youtube_id,
      description: lessonForm.description,
      short_description: lessonForm.short_description,
      duration_seconds: lessonForm.duration_seconds,
      order: lessonForm.order,
      is_published: lessonForm.is_published,
      thumbnail_url: lessonForm.thumbnail_url,
      resource_url: lessonForm.resource_url,
      external_link: lessonForm.external_link,
    };
    if (lessonForm.id) {
      await api(`/lessons/${lessonForm.id}/`, { method: "PATCH", body: JSON.stringify(payload) }, token);
    } else {
      await api("/lessons/", { method: "POST", body: JSON.stringify(payload) }, token);
    }
    setLessonForm({ id: 0, subject: 0, title: "", youtube_id: "", description: "", short_description: "", duration_seconds: 0, order: 1, is_published: true, thumbnail_url: "", resource_url: "", external_link: "" });
    await loadAll(token);
  }

  async function updateContactStatus(id: number, status: ContactRequest["status"]) {
    if (!token) return;
    await api(`/contact-requests/${id}/`, { method: "PATCH", body: JSON.stringify({ status }) }, token);
    await loadAll(token);
  }

  async function removeItem(kind: "categories" | "classes" | "subjects" | "lessons", id: number) {
    if (!token) return;
    await api(`/${kind}/${id}/`, { method: "DELETE" }, token);
    await loadAll(token);
  }

  if (!token) {
    return (
      <main className="py-16">
        <div className="ac-container max-w-xl">
          <div className="ac-card p-8">
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="mt-2 text-sm text-muted-foreground">Professional boshqaruv va analytics uchun staff login qiling.</p>
            <form onSubmit={loginAdmin} className="mt-6 grid gap-3">
              <input className="rounded-xl border border-border bg-background px-4 py-2" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
              <input className="rounded-xl border border-border bg-background px-4 py-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
              <button className="ac-btn bg-foreground text-background" disabled={loading}>{loading ? "Kutilmoqda..." : "Kirish"}</button>
            </form>
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-10">
      <div className="ac-container space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">Scholar Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Advanced analytics + content lifecycle CRUD</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="ac-btn border border-border" onClick={() => void loadAll(token)} disabled={loading}>Yangilash</button>
            <button className="ac-btn border border-border" onClick={() => void exportCsv("top_pages")}>Top Pages CSV</button>
            <button className="ac-btn border border-border" onClick={() => void exportCsv("events")}>Events CSV</button>
            <button className="ac-btn bg-foreground text-background" onClick={logout}>Chiqish</button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <select className="rounded-xl border border-border bg-background px-3 py-2" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={7}>7 kun</option>
            <option value={30}>30 kun</option>
            <option value={90}>90 kun</option>
            <option value={180}>180 kun</option>
          </select>
          <select className="rounded-xl border border-border bg-background px-3 py-2" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">Category: hammasi</option>
            {categories.map((c) => <option key={c.id} value={c.slug}>{c.title}</option>)}
          </select>
          <select className="rounded-xl border border-border bg-background px-3 py-2" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
            <option value="">Class: hammasi</option>
            {classes.map((c) => <option key={c.id} value={c.slug}>{c.title}</option>)}
          </select>
          <select className="rounded-xl border border-border bg-background px-3 py-2" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
            <option value="">Subject: hammasi</option>
            {subjects.map((s) => <option key={s.id} value={s.slug}>{s.title}</option>)}
          </select>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <section className="grid gap-4 md:grid-cols-5">
          <Metric title="Visitors" value={dashboard?.summary.unique_visitors ?? 0} />
          <Metric title="Page Views" value={dashboard?.summary.total_page_views ?? 0} />
          <Metric title="Sessions" value={dashboard?.summary.total_sessions ?? 0} />
          <Metric title="Avg Depth" value={dashboard?.summary.avg_session_depth ?? 0} />
          <Metric title="Categories" value={dashboard?.summary.total_categories ?? 0} />
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="ac-card p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold">Trafik trend</h2>
            <div className="mt-4 flex h-56 items-end gap-2">
              {dailyChart.map((point) => (
                <div key={point.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-md bg-foreground/15" style={{ height: `${point.percent}%` }} />
                  <span className="text-[10px] text-muted-foreground">{point.day.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ac-card p-6">
            <h2 className="text-lg font-semibold">Event taqsimoti</h2>
            <div className="mt-4 space-y-2">
              {(dashboard?.event_breakdown || []).map((e) => (
                <div key={e.event_type} className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 text-sm">
                  <span>{e.event_type}</span>
                  <span className="font-semibold">{e.total}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="ac-card p-6">
            <h2 className="text-lg font-semibold">Top sahifalar</h2>
            <div className="mt-4 space-y-2">
              {(dashboard?.top_pages || []).slice(0, 10).map((item) => (
                <div key={item.path} className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 text-sm">
                  <span className="truncate pr-2">{item.path}</span>
                  <span className="font-semibold">{item.visits}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ac-card p-6">
            <h2 className="text-lg font-semibold">Top lessons</h2>
            <div className="mt-4 space-y-2">
              {(dashboard?.top_lessons || []).slice(0, 10).map((item) => (
                <div key={item.slug} className="rounded-lg border border-border/40 px-3 py-2 text-sm">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.subject__school_class__title} / {item.subject__title}</p>
                  <p className="text-xs">Views: {item.views}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-2 md:grid-cols-5">
          <TabButton active={activeTab === "categories"} label="Categories" onClick={() => setActiveTab("categories")} />
          <TabButton active={activeTab === "classes"} label="Classes" onClick={() => setActiveTab("classes")} />
          <TabButton active={activeTab === "subjects"} label="Subjects" onClick={() => setActiveTab("subjects")} />
          <TabButton active={activeTab === "lessons"} label="Lessons" onClick={() => setActiveTab("lessons")} />
          <TabButton active={activeTab === "contacts"} label="Contacts" onClick={() => setActiveTab("contacts")} />
        </section>

        {activeTab === "categories" && (
          <CrudCard title="Category CRUD" onSubmit={submitCategory} submitLabel={categoryForm.id ? "Update" : "Create"}>
            <Input value={categoryForm.title} onChange={(v) => setCategoryForm((s) => ({ ...s, title: v }))} placeholder="Category title" />
            <Input value={categoryForm.color} onChange={(v) => setCategoryForm((s) => ({ ...s, color: v }))} placeholder="Color" />
            <Input value={categoryForm.icon_url} onChange={(v) => setCategoryForm((s) => ({ ...s, icon_url: v }))} placeholder="Icon URL" />
            <textarea className="rounded-xl border border-border bg-background px-3 py-2" value={categoryForm.description} onChange={(e) => setCategoryForm((s) => ({ ...s, description: e.target.value }))} placeholder="Description" />
            <Input type="number" value={String(categoryForm.order)} onChange={(v) => setCategoryForm((s) => ({ ...s, order: Number(v) || 1 }))} placeholder="Order" />
            <ListBox>
              {categories.map((item) => (
                <Row key={item.id} title={item.title} subtitle={`${item.slug} | ${item.color || "no-color"}`} onEdit={() => setCategoryForm({ ...item })} onDelete={() => void removeItem("categories", item.id)} />
              ))}
            </ListBox>
          </CrudCard>
        )}

        {activeTab === "classes" && (
          <CrudCard title="Class CRUD" onSubmit={submitClass} submitLabel={classForm.id ? "Update" : "Create"}>
            <Input value={classForm.title} onChange={(v) => setClassForm((s) => ({ ...s, title: v }))} placeholder="Class title" />
            <textarea className="rounded-xl border border-border bg-background px-3 py-2" value={classForm.description} onChange={(e) => setClassForm((s) => ({ ...s, description: e.target.value }))} placeholder="Description" />
            <Input value={classForm.hero_image_url} onChange={(v) => setClassForm((s) => ({ ...s, hero_image_url: v }))} placeholder="Hero image URL" />
            <Input value={classForm.cover_image_url} onChange={(v) => setClassForm((s) => ({ ...s, cover_image_url: v }))} placeholder="Cover image URL" />
            <Input value={classForm.external_link} onChange={(v) => setClassForm((s) => ({ ...s, external_link: v }))} placeholder="External link" />
            <ListBox>
              {classes.map((item) => (
                <Row key={item.id} title={item.title} subtitle={item.slug} onEdit={() => setClassForm({ ...item })} onDelete={() => void removeItem("classes", item.id)} />
              ))}
            </ListBox>
          </CrudCard>
        )}

        {activeTab === "subjects" && (
          <CrudCard title="Subject CRUD" onSubmit={submitSubject} submitLabel={subjectForm.id ? "Update" : "Create"}>
            <select className="rounded-xl border border-border bg-background px-3 py-2" value={subjectForm.school_class} onChange={(e) => setSubjectForm((s) => ({ ...s, school_class: Number(e.target.value) }))}>
              <option value={0}>Class tanlang</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <select className="rounded-xl border border-border bg-background px-3 py-2" value={subjectForm.category || 0} onChange={(e) => setSubjectForm((s) => ({ ...s, category: Number(e.target.value) }))}>
              <option value={0}>Category tanlang</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <Input value={subjectForm.title} onChange={(v) => setSubjectForm((s) => ({ ...s, title: v }))} placeholder="Subject title" />
            <Input value={subjectForm.color} onChange={(v) => setSubjectForm((s) => ({ ...s, color: v }))} placeholder="Color" />
            <Input value={subjectForm.thumbnail_url} onChange={(v) => setSubjectForm((s) => ({ ...s, thumbnail_url: v }))} placeholder="Thumbnail URL" />
            <Input value={subjectForm.external_link} onChange={(v) => setSubjectForm((s) => ({ ...s, external_link: v }))} placeholder="External link" />
            <ListBox>
              {subjects.map((item) => (
                <Row key={item.id} title={item.title} subtitle={`${item.class_id} | ${item.slug}`} onEdit={() => setSubjectForm({ ...item, category: item.category || 0 })} onDelete={() => void removeItem("subjects", item.id)} />
              ))}
            </ListBox>
          </CrudCard>
        )}

        {activeTab === "lessons" && (
          <CrudCard title="Lesson CRUD" onSubmit={submitLesson} submitLabel={lessonForm.id ? "Update" : "Create"}>
            <select className="rounded-xl border border-border bg-background px-3 py-2" value={lessonForm.subject} onChange={(e) => setLessonForm((s) => ({ ...s, subject: Number(e.target.value) }))}>
              <option value={0}>Subject tanlang</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            <Input value={lessonForm.title} onChange={(v) => setLessonForm((s) => ({ ...s, title: v }))} placeholder="Lesson title" />
            <Input value={lessonForm.youtube_id} onChange={(v) => setLessonForm((s) => ({ ...s, youtube_id: v }))} placeholder="YouTube ID" />
            <textarea className="rounded-xl border border-border bg-background px-3 py-2" value={lessonForm.description} onChange={(e) => setLessonForm((s) => ({ ...s, description: e.target.value }))} placeholder="Description" />
            <Input value={lessonForm.short_description} onChange={(v) => setLessonForm((s) => ({ ...s, short_description: v }))} placeholder="Short description" />
            <Input type="number" value={String(lessonForm.duration_seconds)} onChange={(v) => setLessonForm((s) => ({ ...s, duration_seconds: Number(v) || 0 }))} placeholder="Duration (sec)" />
            <Input value={lessonForm.thumbnail_url} onChange={(v) => setLessonForm((s) => ({ ...s, thumbnail_url: v }))} placeholder="Thumbnail URL" />
            <Input value={lessonForm.resource_url} onChange={(v) => setLessonForm((s) => ({ ...s, resource_url: v }))} placeholder="Resource URL" />
            <Input value={lessonForm.external_link} onChange={(v) => setLessonForm((s) => ({ ...s, external_link: v }))} placeholder="External link" />
            <ListBox>
              {lessons.map((item) => (
                <Row key={item.id} title={item.title} subtitle={`${item.slug} | views: ${item.views_count}`} onEdit={() => setLessonForm({ ...item })} onDelete={() => void removeItem("lessons", item.id)} />
              ))}
            </ListBox>
          </CrudCard>
        )}

        {activeTab === "contacts" && (
          <div className="ac-card p-5">
            <h3 className="text-lg font-semibold">Contact Requests</h3>
            <div className="mt-4 space-y-2 max-h-[560px] overflow-auto">
              {contacts.map((item) => (
                <div key={item.id} className="rounded-lg border border-border/40 p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold">{item.full_name}</p>
                      <p className="text-xs text-muted-foreground">{item.email} {item.phone ? `| ${item.phone}` : ""}</p>
                    </div>
                    <select
                      className="rounded-lg border border-border bg-background px-2 py-1 text-xs"
                      value={item.status}
                      onChange={(e) => void updateContactStatus(item.id, e.target.value as ContactRequest["status"])}
                    >
                      <option value="new">new</option>
                      <option value="in_progress">in_progress</option>
                      <option value="resolved">resolved</option>
                      <option value="spam">spam</option>
                    </select>
                  </div>
                  <p className="mt-2 text-muted-foreground">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Metric({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="ac-card p-4">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-xl border px-3 py-2 text-sm ${active ? "bg-foreground text-background" : "bg-background"}`}>
      {label}
    </button>
  );
}

function CrudCard({ title, onSubmit, submitLabel, children }: { title: string; onSubmit: (e: FormEvent) => void; submitLabel: string; children: React.ReactNode }) {
  return (
    <div className="ac-card p-5">
      <h3 className="text-lg font-semibold">{title}</h3>
      <form onSubmit={onSubmit} className="mt-3 grid gap-2">
        {children}
        <button className="ac-btn bg-foreground text-background" type="submit">{submitLabel}</button>
      </form>
    </div>
  );
}

function ListBox({ children }: { children: React.ReactNode }) {
  return <div className="mt-3 space-y-2 max-h-72 overflow-auto">{children}</div>;
}

function Row({ title, subtitle, onEdit, onDelete }: { title: string; subtitle: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="rounded-lg border border-border/40 p-2 text-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="text-xs text-blue-600" onClick={onEdit}>Edit</button>
          <button type="button" className="text-xs text-destructive" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: { value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return <input className="rounded-xl border border-border bg-background px-3 py-2" type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />;
}

function normalizeList<T>(input: { results: T[] } | T[]): T[] {
  if (Array.isArray(input)) return input;
  return input.results;
}