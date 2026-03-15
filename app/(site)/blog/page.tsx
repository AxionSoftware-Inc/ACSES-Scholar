import { Container } from "@/app/components/layout/Container";
import { getBlogPosts } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Blog • ACSES Scholar",
  description: "Ilmiy maqolalar, darsliklar va so'nggi yangiliklar.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="py-14 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <h1 className="ac-h1">Bizning Blog</h1>
          <p className="mt-6 ac-lead">
            Ilm-fan, texnologiya va ta&apos;lim sohasidagi eng qiziqarli maqolalar, 
            formula va grafiklar bilan boyitilgan darsliklarni mutolaa qiling.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="mt-16 text-center p-20 ac-card bg-muted/20">
            <p className="text-muted-foreground">Hozircha maqolalar qo&apos;shilmagan.</p>
          </div>
        ) : (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/blog/${post.slug}`}
                className="group ac-card overflow-hidden flex flex-col h-full hover:shadow-2xl hover:border-primary/30 transition-all duration-500"
              >
                <div className="relative h-56 w-full overflow-hidden">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground font-medium">ACSES</span>
                    </div>
                  )}
                  {post.category_name && (
                    <div className="absolute top-4 left-4">
                      <span className="ac-chip bg-background/90 backdrop-blur-sm border-none shadow-sm">
                        {post.category_name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.created_at).toLocaleDateString('uz-UZ')}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {post.author_name || "Admin"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-4">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-8 flex-grow">
                    {post.excerpt || "Ushbu maqolada mavzu bo'yicha batafsil ma'lumot berilgan..."}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-semibold text-primary mt-auto">
                    Batafsil o&apos;qish
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
