"use client";

import Link from "next/link";
import { useState } from "react";
import { statements, bills, congressMembers, techTopics } from "@/data/capitol-pulse";
import { ScrollReveal } from "@/components/ScrollAnimations";

type DataFormat = "json" | "csv";
type DataType = "statements" | "bills" | "members" | "all";

export default function DataDownloadPage() {
  const [format, setFormat] = useState<DataFormat>("json");
  const [dataType, setDataType] = useState<DataType>("all");
  
  const lastUpdated = new Date().toISOString().split('T')[0];

  const generateCSV = (data: Record<string, unknown>[], headers: string[]): string => {
    const csvRows = [headers.join(",")];
    data.forEach(row => {
      const values = headers.map(h => {
        const val = row[h];
        if (Array.isArray(val)) return `"${val.join("; ")}"`;
        if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
        return String(val ?? "");
      });
      csvRows.push(values.join(","));
    });
    return csvRows.join("\n");
  };

  const handleDownload = () => {
    let data: string;
    let filename: string;
    let mimeType: string;

    if (format === "json") {
      mimeType = "application/json";
      const exportData: Record<string, unknown> = {};
      
      if (dataType === "statements" || dataType === "all") {
        exportData.statements = statements.map(s => ({
          ...s,
          memberName: congressMembers.find(m => m.id === s.memberId)?.name
        }));
      }
      if (dataType === "bills" || dataType === "all") {
        exportData.bills = bills.map(b => ({
          ...b,
          sponsorNames: b.sponsors.map(id => congressMembers.find(m => m.id === id)?.name)
        }));
      }
      if (dataType === "members" || dataType === "all") {
        exportData.members = congressMembers;
      }
      if (dataType === "all") {
        exportData.topics = techTopics;
        exportData.exportedAt = new Date().toISOString();
      }
      
      data = JSON.stringify(exportData, null, 2);
      filename = `capitol-pulse-${dataType}-${lastUpdated}.json`;
    } else {
      mimeType = "text/csv";
      
      if (dataType === "statements") {
        const headers = ["id", "title", "publishedAt", "memberName", "topics", "tone", "toneConfidence", "framings", "sourceUrl"];
        const csvData = statements.map(s => ({
          ...s,
          memberName: congressMembers.find(m => m.id === s.memberId)?.name
        }));
        data = generateCSV(csvData, headers);
        filename = `capitol-pulse-statements-${lastUpdated}.csv`;
      } else if (dataType === "bills") {
        const headers = ["number", "title", "status", "introducedAt", "topics", "sponsorNames", "congressGovUrl"];
        const csvData = bills.map(b => ({
          ...b,
          sponsorNames: b.sponsors.map(id => congressMembers.find(m => m.id === id)?.name).join("; ")
        }));
        data = generateCSV(csvData, headers);
        filename = `capitol-pulse-bills-${lastUpdated}.csv`;
      } else if (dataType === "members") {
        const headers = ["id", "name", "chamber", "party", "state", "district", "officialWebsite"];
        data = generateCSV(congressMembers as unknown as Record<string, unknown>[], headers);
        filename = `capitol-pulse-members-${lastUpdated}.csv`;
      } else {
        // For 'all', create a combined JSON regardless
        const exportData = {
          statements: statements.map(s => ({
            ...s,
            memberName: congressMembers.find(m => m.id === s.memberId)?.name
          })),
          bills: bills.map(b => ({
            ...b,
            sponsorNames: b.sponsors.map(id => congressMembers.find(m => m.id === id)?.name)
          })),
          members: congressMembers,
          topics: techTopics,
          exportedAt: new Date().toISOString()
        };
        data = JSON.stringify(exportData, null, 2);
        filename = `capitol-pulse-all-${lastUpdated}.json`;
        mimeType = "application/json";
      }
    }

    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <header className="mb-12">
          <ScrollReveal animation="fade-down">
            <Link href="/capitol-pulse" className="text-emerald-400 hover:text-emerald-300 text-sm mb-4 inline-block">
              ← Back to Capitol Pulse
            </Link>
          </ScrollReveal>
          
          <ScrollReveal animation="zoom-in" delay={100}>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Download Data
            </h1>
          </ScrollReveal>
          
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-white/60 text-lg leading-relaxed">
              All Capitol Pulse data is available for download. Use it for research, 
              analysis, or building your own tools—just cite us and review our methodology.
            </p>
          </ScrollReveal>
        </header>

        {/* Download Card */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-8 mb-8">
            <h2 className="text-xl font-display font-bold text-white mb-6">
              Export Options
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {/* Data Type */}
              <div>
                <label className="text-white/50 text-sm mb-3 block">What to Export</label>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "Everything", desc: "Statements, bills, members, topics" },
                    { value: "statements", label: "Statements Only", desc: "Press releases with tags" },
                    { value: "bills", label: "Bills Only", desc: "Legislation with sponsors" },
                    { value: "members", label: "Members Only", desc: "Congress member directory" }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setDataType(opt.value as DataType)}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        dataType === opt.value 
                          ? "bg-emerald-500/20 border-2 border-emerald-500/50" 
                          : "bg-white/5 border-2 border-transparent hover:bg-white/10"
                      }`}
                    >
                      <p className="text-white font-medium">{opt.label}</p>
                      <p className="text-white/40 text-sm">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Format */}
              <div>
                <label className="text-white/50 text-sm mb-3 block">Format</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setFormat("json")}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      format === "json" 
                        ? "bg-emerald-500/20 border-2 border-emerald-500/50" 
                        : "bg-white/5 border-2 border-transparent hover:bg-white/10"
                    }`}
                  >
                    <p className="text-white font-medium">JSON</p>
                    <p className="text-white/40 text-sm">Best for developers & APIs</p>
                  </button>
                  
                  <button
                    onClick={() => setFormat("csv")}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      format === "csv" 
                        ? "bg-emerald-500/20 border-2 border-emerald-500/50" 
                        : "bg-white/5 border-2 border-transparent hover:bg-white/10"
                    }`}
                  >
                    <p className="text-white font-medium">CSV</p>
                    <p className="text-white/40 text-sm">Best for Excel & spreadsheets</p>
                  </button>
                </div>
                
                {dataType === "all" && format === "csv" && (
                  <p className="text-amber-400/80 text-xs mt-3">
                    Note: "Everything" export uses JSON format regardless of selection.
                  </p>
                )}
              </div>
            </div>
            
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-500 hover:scale-[1.02]"
            >
              Download {dataType === "all" ? "All Data" : dataType.charAt(0).toUpperCase() + dataType.slice(1)} ({format.toUpperCase()})
            </button>
          </div>
        </ScrollReveal>

        {/* Data Summary */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-8 mb-8">
            <h2 className="text-xl font-display font-bold text-white mb-6">
              What's Included
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-3xl font-display font-bold text-emerald-400">{statements.length}</p>
                <p className="text-white/40 text-sm">Statements</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-3xl font-display font-bold text-cyan-400">{bills.length}</p>
                <p className="text-white/40 text-sm">Bills</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <p className="text-3xl font-display font-bold text-purple-400">{congressMembers.length}</p>
                <p className="text-white/40 text-sm">Members</p>
              </div>
            </div>
            
            <p className="text-white/40 text-sm text-center">
              Last updated: {lastUpdated}
            </p>
          </div>
        </ScrollReveal>

        {/* Schema Documentation */}
        <ScrollReveal animation="fade-up" delay={250}>
          <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-8 mb-8">
            <h2 className="text-xl font-display font-bold text-white mb-6">
              Data Schema
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-emerald-400 font-mono text-sm mb-2">Statement Object</h3>
                <pre className="bg-black/30 rounded-xl p-4 text-white/70 text-sm overflow-x-auto">
{`{
  "id": "string",
  "memberId": "string",
  "memberName": "string",
  "title": "string",
  "excerpt": "string",
  "sourceUrl": "string",
  "publishedAt": "YYYY-MM-DD",
  "topics": ["AI & Automation", ...],
  "tone": "Support" | "Concern" | "Neutral",
  "toneConfidence": 0-100,
  "framings": ["Innovation", ...],
  "keywords": ["AI", "regulation", ...],
  "entities": ["FTC", "Section 230", ...]
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="text-cyan-400 font-mono text-sm mb-2">Bill Object</h3>
                <pre className="bg-black/30 rounded-xl p-4 text-white/70 text-sm overflow-x-auto">
{`{
  "id": "string",
  "number": "S.1234 | H.R.5678",
  "title": "string",
  "summary": "string",
  "topics": ["Cybersecurity", ...],
  "introducedAt": "YYYY-MM-DD",
  "status": "Introduced" | "In Committee" | ...,
  "sponsors": ["member-id", ...],
  "sponsorNames": ["Name", ...],
  "congressGovUrl": "https://..."
}`}
                </pre>
              </div>
              
              <div>
                <h3 className="text-purple-400 font-mono text-sm mb-2">Member Object</h3>
                <pre className="bg-black/30 rounded-xl p-4 text-white/70 text-sm overflow-x-auto">
{`{
  "id": "string",
  "name": "string",
  "chamber": "House" | "Senate",
  "party": "Democrat" | "Republican" | "Independent",
  "state": "CA",
  "district": "12" | null,
  "officialWebsite": "https://...",
  "techFingerprint": [
    { "topic": "AI & Automation", "score": 85 }
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Terms of Use */}
        <ScrollReveal animation="fade-up" delay={300}>
          <div className="bg-gradient-to-br from-emerald-500/10 via-navy-800/50 to-cyan-500/10 rounded-2xl border border-white/5 p-8">
            <h2 className="text-xl font-display font-bold text-white mb-4">
              Terms of Use
            </h2>
            
            <div className="space-y-4 text-white/70 text-sm">
              <p>
                This data is provided for research, journalism, and civic engagement purposes. 
                By downloading, you agree to:
              </p>
              
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Credit Capitol Pulse / Politechs as your data source</li>
                <li>Link to our methodology page when citing classifications</li>
                <li>Not misrepresent algorithmic estimates as definitive facts</li>
                <li>Not use the data for harassment or targeted attacks on individuals</li>
              </ul>
              
              <p className="text-white/40">
                The underlying source data (press releases, legislation) is public record. 
                Our value-add (classifications, scores, trends) is offered under CC BY-NC 4.0.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* API Coming Soon */}
        <ScrollReveal animation="fade-up" delay={350}>
          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm mb-2">
              Need programmatic access?
            </p>
            <p className="text-white/60">
              API access coming soon. <Link href="mailto:contact@politechs.org" className="text-emerald-400 hover:text-emerald-300">Contact us</Link> for early access.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

