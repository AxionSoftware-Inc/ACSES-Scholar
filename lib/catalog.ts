export type CatalogLesson = {
  id: string;
  title: string;
  youtubeId: string;
  description?: string;
  duration?: string;
};

export type CatalogSubject = {
  id: string;
  title: string;
  color?: string;
  lessons: CatalogLesson[];
};

export type CatalogClass = {
  id: string;
  title: string;
  subjects: CatalogSubject[];
};

type CatalogResponse = {
  classes: CatalogClass[];
};

const API_BASE =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "http://127.0.0.1:8000/api/v1";

export async function getCatalog(): Promise<CatalogClass[]> {
  try {
    const response = await fetch(`${API_BASE}/public/catalog/`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as CatalogResponse;
    return data.classes || [];
  } catch {
    return [];
  }
}
