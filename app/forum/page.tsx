import { ScrollReveal } from "@/components/ScrollAnimations";
import { AnimatedLine } from "@/components/AmbientEffects";

export default function ForumPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-xl px-6">
        {/* Header */}
        <header className="text-center mb-16">
          <ScrollReveal animation="fade-down">
            <p className="text-accent-blue font-medium tracking-[0.3em] uppercase text-sm mb-6">
              Community
            </p>
          </ScrollReveal>
          <ScrollReveal animation="zoom-in" delay={100}>
            <h1 className="page-title text-5xl sm:text-6xl md:text-7xl mb-8">
              Forum Access
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-white/50 text-xl leading-relaxed">
              Want access to our community forum? Leave your email and we'll reach out 
              with a personalized join link.
            </p>
            <AnimatedLine className="w-24 mx-auto mt-8" />
          </ScrollReveal>
        </header>

        {/* Form */}
        <ScrollReveal animation="zoom-in" delay={300}>
          <div className="bg-navy-800/20 rounded-3xl p-10 border border-white/5 hover-glow shine-effect">
            <form
              action="mailto:politechs.info@gmail.com"
              method="post"
              encType="text/plain"
              className="space-y-6"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-3">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-navy-900/50 border border-white/10 text-white placeholder:text-white/30 text-lg transition-all duration-300"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-3">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-navy-900/50 border border-white/10 text-white placeholder:text-white/30 text-lg transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-accent-blue to-accent-red text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300 shine-effect"
              >
                I want access!
              </button>

              <p className="text-sm text-white/40 text-center">
                Don't forget to check your spam folder for our response.
              </p>
            </form>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
