import { ScrollReveal, StaggerContainer } from "@/components/ScrollAnimations";
import { AnimatedLine } from "@/components/AmbientEffects";

export default function ContactPage() {
  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <header className="text-center mb-20">
          <ScrollReveal animation="fade-down">
            <p className="text-accent-blue font-medium tracking-[0.3em] uppercase text-sm mb-6">
              Contact
            </p>
          </ScrollReveal>
          <ScrollReveal animation="zoom-in" delay={100}>
            <h1 className="page-title text-5xl sm:text-6xl md:text-7xl mb-8">
              Get in Touch
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-white/50 max-w-lg mx-auto text-xl leading-relaxed">
              Have questions, ideas, or partnership opportunities? 
              We'd love to hear from you.
            </p>
            <AnimatedLine className="w-24 mx-auto mt-8" />
          </ScrollReveal>
        </header>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Contact Form */}
          <div className="md:col-span-3">
            <ScrollReveal animation="fade-right" delay={300}>
              <div className="bg-navy-800/20 rounded-3xl p-10 border border-white/5 hover-glow shine-effect">
                <h2 className="font-display font-bold text-white text-2xl mb-8">
                  Send a Message
                </h2>
                <form
                  action="mailto:politechs.info@gmail.com"
                  method="post"
                  encType="text/plain"
                  className="space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-3">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-navy-900/50 border border-white/10 text-white placeholder:text-white/30 transition-all duration-300"
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
                        className="w-full px-5 py-4 rounded-2xl bg-navy-900/50 border border-white/10 text-white placeholder:text-white/30 transition-all duration-300"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white/70 mb-3">
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      className="w-full px-5 py-4 rounded-2xl bg-navy-900/50 border border-white/10 text-white placeholder:text-white/30 transition-all duration-300"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/70 mb-3">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full px-5 py-4 rounded-2xl bg-navy-900/50 border border-white/10 text-white placeholder:text-white/30 resize-none transition-all duration-300"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 rounded-full bg-gradient-to-r from-accent-blue to-accent-red text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-all duration-300 shine-effect"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </ScrollReveal>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-2 space-y-8">
            <ScrollReveal animation="fade-left" delay={400}>
              <div className="bg-navy-800/20 rounded-3xl p-8 border border-white/5 hover-glow">
                <h3 className="font-display font-semibold text-white text-xl mb-6">
                  Contact Info
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-white/40 mb-2">Email</p>
                    <a
                      href="mailto:politechs.info@gmail.com"
                      className="text-white text-lg hover:text-accent-blue transition-colors animated-underline"
                    >
                      politechs.info@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-white/40 mb-2">Phone</p>
                    <p className="text-white text-lg">+1 945-216-0206</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left" delay={500}>
              <div className="bg-gradient-to-br from-accent-blue/10 via-navy-800/50 to-accent-red/10 rounded-3xl p-8 border border-white/5 glow-mixed hover-glow">
                <h3 className="font-display font-semibold text-white text-xl mb-4">
                  Join Our Team
                </h3>
                <p className="text-white/50 mb-6">
                  We're looking for writers, editors, researchers, and developers to join{" "}
                  <span className="text-accent-red">Poli</span>
                  <span className="text-accent-blue">techs</span>.
                </p>
                <a
                  href="https://linktr.ee/politechs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent-blue hover:text-white transition-colors font-medium group animated-underline"
                >
                  Apply now 
                  <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
}
