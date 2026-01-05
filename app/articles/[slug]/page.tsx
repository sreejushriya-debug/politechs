import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticleBySlug, getAuthorForArticle, getArticlesByAuthor } from "@/data/articles";
import { ArticleGraphic } from "@/components/ArticleGraphic";
import { CommentSection } from "@/components/CommentSection";

// Generate static params for all articles
export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// Generate metadata for each article
export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: "Article Not Found" };
  
  return {
    title: `${article.title} | Politechs`,
    description: article.description,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  
  if (!article) {
    notFound();
  }

  const author = getAuthorForArticle(article);
  const authorArticles = author ? getArticlesByAuthor(author.slug) : [];

  // Find related articles (same category, excluding current)
  const relatedArticles = articles
    .filter(a => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  return (
    <div className="pt-28 pb-24">
      {/* Hero Section with Graphic */}
      <div className="mx-auto max-w-4xl px-6 mb-12">
        <Link 
          href="/articles"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Articles
        </Link>

        <ArticleGraphic 
          colors={article.graphicColors}
          icon={article.graphicIcon}
          title={article.title}
          size="lg"
          className="mb-8"
        />
      </div>

      <article className="mx-auto max-w-3xl px-6">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-accent-blue/10 text-accent-blue text-sm font-medium">
              {article.category}
            </span>
            <span className="text-white/30 text-sm">{article.readTime}</span>
          </div>
          
          <h1 className="font-display font-bold text-white text-4xl md:text-5xl leading-tight mb-4">
            {article.title}
          </h1>
          
          {article.subtitle && (
            <p className="text-xl md:text-2xl text-white/60 leading-relaxed">
              {article.subtitle}
            </p>
          )}
          
          {/* Author Info */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10">
            <Link 
              href={`/authors/${article.authorSlug}`}
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white hover:scale-110 transition-transform overflow-hidden"
              style={{
                background: author?.image ? 'transparent' : `linear-gradient(135deg, ${article.graphicColors[0]}, ${article.graphicColors[1]})`
              }}
            >
              {author?.image ? (
                <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
              ) : (
                author?.name.charAt(0) || "P"
              )}
            </Link>
            <div>
              <Link 
                href={`/authors/${article.authorSlug}`}
                className="text-white font-medium hover:text-accent-blue transition-colors"
              >
                {author?.name || "Politechs Team"}
              </Link>
              <p className="text-white/50 text-sm">
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric"
                })}
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        {article.hasFullContent && article.content ? (
          <div className="prose prose-invert prose-lg max-w-none">
            {article.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={i} className="font-display font-bold text-white text-2xl mt-12 mb-6">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('# ')) {
                return (
                  <h2 key={i} className="font-display font-bold text-white text-3xl mt-12 mb-6">
                    {paragraph.replace('# ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                // Bold paragraph (used for subheadings in some articles)
                return (
                  <h3 key={i} className="font-display font-semibold text-white text-xl mt-8 mb-4">
                    {paragraph.replace(/\*\*/g, '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('★ ') || paragraph.startsWith('- **')) {
                // List items
                return (
                  <p 
                    key={i} 
                    className="text-white/70 text-lg leading-relaxed mb-4 pl-6"
                    dangerouslySetInnerHTML={{ 
                      __html: paragraph
                        .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>')
                    }}
                  />
                );
              }
              // Regular paragraph - render HTML for links
              return (
                <p 
                  key={i} 
                  className="text-white/70 text-lg leading-relaxed mb-6 [&_a]:text-accent-blue [&_a]:hover:text-white [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-colors"
                  dangerouslySetInnerHTML={{ 
                    __html: paragraph
                      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white">$1</strong>')
                  }}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-navy-800/30 rounded-2xl p-8 text-center border border-white/5">
            <p className="text-white/60 text-lg mb-4">
              Full article content coming soon.
            </p>
            <p className="text-white/40">
              {article.description}
            </p>
          </div>
        )}

        {/* Partnership Attribution */}
        {article.partnership && (
          <div className="mt-12 py-6 border-t border-b border-white/10 text-center">
            <p className="text-white/60 text-lg">
              In Partnership with{' '}
              <span className="text-accent-blue font-semibold">{article.partnership}</span>
            </p>
          </div>
        )}

        {/* About the Author - Larger Section */}
        {author && (
          <div className="mt-16 bg-gradient-to-br from-accent-blue/10 via-navy-800/50 to-accent-red/10 rounded-3xl p-8 md:p-10 border border-white/10">
            <h3 className="text-xs font-medium text-accent-blue uppercase tracking-[0.2em] mb-6">
              About the Author
            </h3>
            
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Link 
                href={`/authors/${author.slug}`}
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 hover:scale-110 transition-transform overflow-hidden"
                style={{
                  background: author.image ? 'transparent' : `linear-gradient(135deg, ${article.graphicColors[0]}, ${article.graphicColors[1]})`
                }}
              >
                {author.image ? (
                  <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
                ) : (
                  author.name.charAt(0)
                )}
              </Link>
              
              <div className="flex-1">
                <Link 
                  href={`/authors/${author.slug}`}
                  className="font-display font-bold text-white text-2xl hover:text-accent-blue transition-colors"
                >
                  {author.name}
                </Link>
                {author.role && (
                  <p className="text-accent-blue text-sm mt-1">{author.role}</p>
                )}
                <p className="text-white/60 text-lg leading-relaxed mt-4">
                  {author.bio}
                </p>
                
                {/* Author stats */}
                <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-2xl font-display font-bold text-white">{authorArticles.length}</p>
                    <p className="text-xs text-white/40">Articles</p>
                  </div>
                  {author.interests && (
                    <div className="flex flex-wrap gap-2">
                      {author.interests.map(interest => (
                        <span key={interest} className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-xs">
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <Link 
                  href={`/authors/${author.slug}`}
                  className="inline-flex items-center gap-2 text-accent-blue hover:text-white transition-colors font-medium mt-4 group"
                >
                  View all articles by {author.name.split(' ')[0]}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Share Actions */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://politechs.vercel.app/articles/${article.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors text-sm"
          >
            Share on Twitter
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://politechs.vercel.app/articles/${article.slug}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors text-sm"
          >
            Share on LinkedIn
          </a>
        </div>

        {/* Comment Section */}
        <div className="mt-16">
          <CommentSection articleSlug={article.slug} />
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 mt-20">
          <h2 className="font-display font-bold text-white text-2xl mb-8">
            More in {article.category}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => {
              const relatedAuthor = getAuthorForArticle(related);
              return (
                <Link key={related.slug} href={`/articles/${related.slug}`}>
                  <article className="group h-full bg-navy-800/20 rounded-2xl overflow-hidden border border-white/5 hover-lift hover-glow">
                    <ArticleGraphic 
                      colors={related.graphicColors}
                      icon={related.graphicIcon}
                      title={related.title}
                      size="sm"
                    />
                    <div className="p-5">
                      <h3 className="font-display font-semibold text-white text-lg leading-snug mb-2 group-hover:text-accent-blue transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-white/40 text-xs">
                        By {relatedAuthor?.name || "Politechs Team"}
                      </p>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="mx-auto max-w-2xl px-6 mt-20 text-center">
        <div className="bg-gradient-to-br from-accent-blue/10 via-navy-800/50 to-accent-red/10 rounded-3xl p-10 border border-white/5">
          <h3 className="font-display font-bold text-white text-2xl mb-4">
            Enjoyed this article?
          </h3>
          <p className="text-white/50 mb-6">
            Subscribe to get more insights on politics and technology.
          </p>
          <form
            action="mailto:politechs.info@gmail.com"
            method="post"
            encType="text/plain"
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-5 py-3 rounded-full bg-navy-900/50 border border-white/10 text-white placeholder:text-white/30"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-red text-white font-semibold hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
