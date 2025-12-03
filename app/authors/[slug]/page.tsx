import Link from "next/link";
import { notFound } from "next/navigation";
import { authors, getAuthorBySlug, getArticlesByAuthor, getAuthorForArticle } from "@/data/articles";
import { ScrollReveal, StaggerContainer } from "@/components/ScrollAnimations";
import { ArticleGraphic } from "@/components/ArticleGraphic";
import { AnimatedLine } from "@/components/AmbientEffects";

// Generate static params for all authors
export function generateStaticParams() {
  return authors.map((author) => ({
    slug: author.slug,
  }));
}

// Generate metadata for each author
export function generateMetadata({ params }: { params: { slug: string } }) {
  const author = getAuthorBySlug(params.slug);
  if (!author) return { title: "Author Not Found" };
  
  return {
    title: `${author.name} | Politechs`,
    description: author.bio,
  };
}

export default function AuthorPage({ params }: { params: { slug: string } }) {
  const author = getAuthorBySlug(params.slug);
  
  if (!author) {
    notFound();
  }

  const authorArticles = getArticlesByAuthor(author.slug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Generate consistent gradient colors for author
  const gradientColors: [string, string] = 
    author.slug === "arya-miller" ? ["#ec4899", "#8b5cf6"] :
    author.slug === "william-spence" ? ["#3b82f6", "#06b6d4"] :
    author.slug === "vidmahi-tantry" ? ["#f59e0b", "#ef4444"] :
    ["#3b82f6", "#8b5cf6"];

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Back link */}
        <Link 
          href="/articles"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Articles
        </Link>

        {/* Author Header */}
        <header className="mb-16">
          <ScrollReveal animation="zoom-in">
            <div className="bg-gradient-to-br from-navy-800/50 to-navy-900/50 rounded-3xl p-10 md:p-12 border border-white/5 glow-mixed">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Avatar */}
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-display font-bold text-white flex-shrink-0 animate-pulse-glow overflow-hidden"
                  style={{
                    background: author.image ? 'transparent' : `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})`
                  }}
                >
                  {author.image ? (
                    <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                  ) : (
                    author.name.charAt(0)
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="font-display font-bold text-white text-4xl md:text-5xl mb-2">
                    {author.name}
                  </h1>
                  
                  {author.role && (
                    <p className="text-accent-blue text-lg mb-4">{author.role}</p>
                  )}
                  
                  {author.school && (
                    <p className="text-white/50 text-sm mb-4">
                      📚 {author.school}
                    </p>
                  )}
                  
                  <p className="text-white/60 text-lg leading-relaxed max-w-2xl">
                    {author.bio}
                  </p>
                  
                  {/* Stats & Interests */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-8 pt-6 border-t border-white/10">
                    <div className="text-center md:text-left">
                      <p className="text-3xl font-display font-bold text-white">{authorArticles.length}</p>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Articles Published</p>
                    </div>
                    
                    {author.interests && author.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {author.interests.map(interest => (
                          <span 
                            key={interest} 
                            className="px-4 py-2 rounded-full text-sm font-medium"
                            style={{
                              background: `linear-gradient(135deg, ${gradientColors[0]}20, ${gradientColors[1]}20)`,
                              color: gradientColors[0]
                            }}
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </header>

        {/* Articles Section */}
        <section>
          <ScrollReveal animation="fade-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-bold text-white text-2xl md:text-3xl">
                Articles by {author.name.split(' ')[0]}
              </h2>
              <p className="text-white/40">
                {authorArticles.length} article{authorArticles.length !== 1 ? 's' : ''}
              </p>
            </div>
            <AnimatedLine className="w-full mb-8" />
          </ScrollReveal>

          {authorArticles.length > 0 ? (
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authorArticles.map((article) => (
                <Link key={article.slug} href={`/articles/${article.slug}`}>
                  <article className="stagger-item group h-full bg-navy-800/20 rounded-2xl overflow-hidden border border-white/5 hover-lift hover-glow">
                    <ArticleGraphic 
                      colors={article.graphicColors}
                      icon={article.graphicIcon}
                      title={article.title}
                      size="sm"
                    />
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-medium">
                          {article.category}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-white text-lg leading-snug mb-3 group-hover:text-accent-blue transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-white/50 text-sm line-clamp-2 mb-4">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-white/30 pt-3 border-t border-white/5">
                        <span>{article.readTime}</span>
                        <span>
                          {new Date(article.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </StaggerContainer>
          ) : (
            <div className="text-center py-16 bg-navy-800/20 rounded-2xl border border-white/5">
              <p className="text-white/50 text-lg">
                No articles published yet.
              </p>
            </div>
          )}
        </section>

        {/* Contact CTA */}
        <ScrollReveal animation="fade-up">
          <div className="mt-16 bg-navy-800/30 rounded-3xl p-8 text-center border border-white/5">
            <h3 className="font-display font-semibold text-white text-xl mb-3">
              Want to connect with {author.name.split(' ')[0]}?
            </h3>
            <p className="text-white/50 mb-6">
              Reach out through our contact page to get in touch with our writers.
            </p>
            <Link 
              href="/contact"
              className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-red text-white font-semibold hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

