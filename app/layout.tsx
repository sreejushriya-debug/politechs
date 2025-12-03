import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Politechs | Where Politics Meets Tech",
  description:
    "Empowering future innovators at the crossroads of political science and technology through articles, forums, and civic hackathons."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-grid-pattern">
        {/* Ambient background effects */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-accent-blue/5 rounded-full blur-[150px] animate-glow-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-red/5 rounded-full blur-[150px] animate-glow-pulse delay-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-accent-blue/3 to-accent-red/3 rounded-full blur-[200px] animate-spin-slow" />
        </div>
        
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
