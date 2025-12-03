import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy-900 border-t border-white/5 mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-display font-bold text-2xl tracking-tight">
                <span className="text-accent-red">Poli</span>
                <span className="text-accent-blue">techs</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-white/60 max-w-sm leading-relaxed">
              Where politics meets tech. Empowering future civic innovators through thought leadership and hands-on hackathons.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-semibold text-white mb-4">Pages</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-white/60 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/articles" className="text-white/60 hover:text-white transition-colors">Articles</Link></li>
              <li><Link href="/forum" className="text-white/60 hover:text-white transition-colors">Forum</Link></li>
              <li><Link href="/hackathon" className="text-white/60 hover:text-white transition-colors">Hackathon</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href="mailto:politechs.info@gmail.com" className="hover:text-white transition-colors">
                  politechs.info@gmail.com
                </a>
              </li>
              <li>+1 945-216-0206</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 text-center text-xs text-white/40">
          © {new Date().getFullYear()} <span className="text-accent-red">Poli</span><span className="text-accent-blue">techs</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
