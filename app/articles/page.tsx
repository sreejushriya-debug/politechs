"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { articles, categories, getAuthorForArticle } from "@/data/articles";
import { ScrollReveal } from "@/components/ScrollAnimations";
import { AnimatedLine } from "@/components/AmbientEffects";
import { ArticleGraphic } from "@/components/ArticleGraphic";

const ARTICLES_PER_PAGE = 9;

export default function ArticlesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  
  const sorted = [...articles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  const filtered = selectedCategory === "All" 
    ? sorted 
    : sorted.filter(article => article.category === selectedCategory);

  // Pagination
  const totalPages = Math.ceil(filtered.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = filtered.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  // Reset to page 1 when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <header className="text-center mb-16">
          <ScrollReveal animation="fade-down">
            <p className="text-accent-blue font-medium tracking-[0.3em] uppercase text-sm mb-6">
              Thought Gallery
            </p>
          </ScrollReveal>
          <ScrollReveal animation="zoom-in" delay={100}>
            <h1 className="page-title text-5xl sm:text-6xl md:text-7xl mb-8">
              Articles
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-white/50 max-w-2xl mx-auto text-xl leading-relaxed">
              Technology is changing the political landscape in profound ways. 
              Explore our analysis on the intersection of politics and tech.
            </p>
            <AnimatedLine className="w-24 mx-auto mt-8" />
          </ScrollReveal>
        </header>

        {/* Category Filter */}
        <ScrollReveal animation="fade-up" delay={300}>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-accent-blue to-accent-red text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Results count */}
        <p className="text-white/40 text-sm mb-8 text-center">
          Showing {startIndex + 1}–{Math.min(startIndex + ARTICLES_PER_PAGE, filtered.length)} of {filtered.length} article{filtered.length !== 1 ? "s" : ""}
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
        </p>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {paginatedArticles.map((article, i) => {
            const author = getAuthorForArticle(article);
            return (
              <ScrollReveal key={article.slug} animation="fade-up" delay={Math.min(i * 50, 300)}>
                <article 
                  onClick={() => router.push(`/articles/${article.slug}`)}
                  className="group h-full bg-navy-800/20 rounded-2xl overflow-hidden border border-white/5 hover-lift hover-glow cursor-pointer flex flex-col"
                >
                  {/* Article Graphic */}
                  <ArticleGraphic 
                    colors={article.graphicColors}
                    icon={article.graphicIcon}
                    title={article.title}
                    size="sm"
                  />
                  
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-medium">
                        {article.category}
                      </span>
                    </div>
                    
                    <h2 className="font-display font-semibold text-white text-lg leading-snug mb-3 group-hover:text-accent-blue transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h2>
                    
                    <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
                      {article.description}
                    </p>
                    
                    {/* Author & Meta */}
                      <div className="flex items-center justify-between text-xs text-white/40 pt-4 border-t border-white/5">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/authors/${article.authorSlug}`);
                          }}
                          className="flex items-center gap-2 hover:text-accent-blue transition-colors"
                        >
                          {author?.image ? (
                            <Image
                              src={author.image}
                              alt={author.name}
                              width={20}
                              height={20}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                          ) : (
                            <div 
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                              style={{
                                background: `linear-gradient(135deg, ${article.graphicColors[0]}, ${article.graphicColors[1]})`
                              }}
                            >
                              {author?.name.charAt(0) || "P"}
                            </div>
                          )}
                          <span>{author?.name || "Politechs Team"}</span>
                        </button>
                        <span>
                          {new Date(article.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                      </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-16">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            
            <div className="flex items-center gap-1 mx-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-300 ${
                    currentPage === page
                      ? "bg-gradient-to-r from-accent-blue to-accent-red text-white"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}

        {/* No results */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/50 text-lg">No articles found in this category.</p>
          </div>
        )}

        {/* Write for Us */}
        <ScrollReveal animation="zoom-in" delay={200}>
          <div className="mt-12 bg-gradient-to-br from-accent-blue/10 via-navy-800/50 to-accent-red/10 rounded-3xl p-10 md:p-12 text-center border border-white/5 glow-mixed hover-glow">
            <h3 className="font-display font-bold text-white text-3xl md:text-4xl mb-4">
              Want to write for us?
            </h3>
            <p className="text-white/50 mb-8 max-w-lg mx-auto text-lg">
              We're always looking for new voices at the intersection of politics and technology.
            </p>
            <a
              href="https://linktr.ee/politechs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 rounded-full bg-white text-navy-950 font-bold text-lg hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all duration-500 hover:scale-105 shine-effect"
            >
              Join Our Team
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
