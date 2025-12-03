"use client";

import { useState } from "react";

interface CommentSectionProps {
  articleSlug: string;
}

export function CommentSection({ articleSlug }: CommentSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send to a backend
    // For now, we'll use mailto as a fallback
    const subject = encodeURIComponent(`Comment on article: ${articleSlug}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nComment:\n${comment}`);
    window.location.href = `mailto:politechs.info@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-navy-800/30 rounded-3xl p-8 border border-white/5 text-center">
        <div className="text-4xl mb-4">💬</div>
        <h3 className="font-display font-bold text-white text-xl mb-2">
          Thank you for your comment!
        </h3>
        <p className="text-white/50">
          Your comment has been submitted and is awaiting moderation.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setName("");
            setEmail("");
            setComment("");
          }}
          className="mt-4 text-accent-blue hover:text-white transition-colors"
        >
          Submit another comment
        </button>
      </div>
    );
  }

  return (
    <div className="bg-navy-800/30 rounded-3xl p-8 border border-white/5">
      <h3 className="font-display font-bold text-white text-2xl mb-2">
        Leave a Comment
      </h3>
      <p className="text-white/50 mb-6">
        Share your thoughts on this article. Your comment will be reviewed before publishing.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="comment-name" className="block text-sm font-medium text-white/70 mb-2">
              Name *
            </label>
            <input
              id="comment-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-navy-900/50 border border-white/10 text-white placeholder:text-white/30 transition-all duration-300"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="comment-email" className="block text-sm font-medium text-white/70 mb-2">
              Email *
            </label>
            <input
              id="comment-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-navy-900/50 border border-white/10 text-white placeholder:text-white/30 transition-all duration-300"
              placeholder="you@example.com"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="comment-text" className="block text-sm font-medium text-white/70 mb-2">
            Comment *
          </label>
          <textarea
            id="comment-text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-navy-900/50 border border-white/10 text-white placeholder:text-white/30 resize-none transition-all duration-300"
            placeholder="Share your thoughts..."
          />
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/40">
            Your email will not be published.
          </p>
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-accent-blue to-accent-red text-white font-semibold hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300 shine-effect"
          >
            Post Comment
          </button>
        </div>
      </form>
    </div>
  );
}

