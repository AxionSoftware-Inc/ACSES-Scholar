import { Container } from "@/app/components/layout/Container";
import { getBlogPost } from "@/lib/blog";
import { RichTextRenderer } from "@/app/components/blog/RichTextRenderer";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, User, Tag as TagIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

async function resolveParams(params: BlogPostPageProps["params"]) {
  return await Promise.resolve(params);
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await resolveParams(params);
  const post = await getBlogPost(slug);
  if (!post) return {};

  return {
    title: `${post.meta_title || post.title} • ACSES Blog`,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await resolveParams(params);
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="pb-24">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] w-full bg-muted">
        {post.thumbnail && (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        
        <Container>
          <div className="relative h-full flex flex-col justify-end pb-12">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Blogga qaytish
            </Link>
            
            <div className="max-w-4xl">
              {post.category_name && (
                <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold mb-4 uppercase tracking-wider">
                  {post.category_name}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                {post.title}
              </h1>
              
              <div className="mt-8 flex flex-wrap items-center gap-6 text-white/90 text-sm">
                <span className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  {new Date(post.created_at).toLocaleDateString('uz-UZ')}
                </span>
                <span className="flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  {post.author_name || "Admin"}
                </span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className="mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-16">
            {/* Main Content */}
            <div className="min-w-0">
              <RichTextRenderer 
                content={post.content} 
                hasAnimation={post.has_animation} 
              />

              {/* Tags */}
              {post.tags_list && post.tags_list.length > 0 && (
                <div className="mt-16 pt-8 border-t border-border">
                  <div className="flex items-center gap-3 flex-wrap">
                    <TagIcon size={18} className="text-muted-foreground" />
                    {post.tags_list.map((tag) => (
                      <span 
                        key={tag.id} 
                        className="px-3 py-1 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-12">
                {/* Features Summary */}
                <div className="ac-card p-6 bg-muted/30 border-none">
                  <h4 className="font-bold mb-4">Maqola tarkibi</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Formulalar</span>
                      <span className={post.has_math ? "text-primary font-bold" : "text-muted-foreground/30"}>
                        {post.has_math ? "Mavjud" : "Yo'q"}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Grafiklar</span>
                      <span className={post.has_chart ? "text-primary font-bold" : "text-muted-foreground/30"}>
                        {post.has_chart ? "Mavjud" : "Yo'q"}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Video dars</span>
                      <span className={post.has_video ? "text-primary font-bold" : "text-muted-foreground/30"}>
                        {post.has_video ? "Mavjud" : "Yo'q"}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Animatsiyalar</span>
                      <span className={post.has_animation ? "text-primary font-bold" : "text-muted-foreground/30"}>
                        {post.has_animation ? "Mavjud" : "Yo'q"}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Share? */}
                <div>
                  <h4 className="font-bold mb-4">Ulashish</h4>
                  <div className="flex gap-2">
                    <button className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center hover:opacity-80 transition-opacity">T</button>
                    <button className="h-10 w-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:opacity-80 transition-opacity">F</button>
                    <button className="h-10 w-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:opacity-80 transition-opacity">W</button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </article>
  );
}
