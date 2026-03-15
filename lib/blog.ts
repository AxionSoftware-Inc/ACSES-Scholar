export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnail?: string; // This will be the full URL from DRF
  category_name?: string;
  author_name?: string;
  tags_list?: Tag[];
  has_math: boolean;
  has_chart: boolean;
  has_video: boolean;
  has_animation: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
};

const API_BASE =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "http://127.0.0.1:8000/api/v1";

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_BASE}/blog-posts/`, {
      next: { revalidate: 60 }, // ISR: Cache for 60 seconds
    });
    
    if (!res.ok) return [];
    
    const data = await res.json();
    // DRF may return results in 'results' field if paginated
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    // We filter by slug using DRF query params
    const res = await fetch(`${API_BASE}/blog-posts/?slug=${slug}`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    const posts = Array.isArray(data) ? data : data.results || [];
    
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error(`Failed to fetch blog post with slug ${slug}:`, error);
    return null;
  }
}
