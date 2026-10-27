import type { Metadata } from "next";
import { SubNav } from "@/components/capitol-pulse/SubNav";

export const metadata: Metadata = {
  title: "Capitol Pulse | Politechs",
  description: "Every tech bill in Congress, in plain English: what it does, who wrote it, how far it has gotten, and what your lawmakers are doing."
};

export default function CapitolPulseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-[65px] pb-24 min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        <SubNav />
        {children}
      </div>
    </div>
  );
}
