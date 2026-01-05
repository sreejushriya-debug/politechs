"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { techTopics } from "@/data/capitol-pulse";
import { getMembers, getBills, getStatements, getCoverageMetrics } from "@/lib/capitol-pulse/data-store";
import { CongressMember, Bill, Statement, CoverageMetrics } from "@/lib/capitol-pulse/types";
import { ScrollReveal } from "@/components/ScrollAnimations";

type DataFormat = "json" | "csv";
type DataType = "statements" | "bills" | "members" | "all";

export default function DataDownloadPage() {
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<CongressMember[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [statements, setStatements] = useState<Statement[]>([]);
  const [coverage, setCoverage] = useState<CoverageMetrics | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [dataSource, setDataSource] = useState<string>("");

  const [format, setFormat] = useState<DataFormat>("json");
  const [dataType, setDataType] = useState<DataType>("all");

  useEffect(() => {
    async function loadData() {
      try {
        const [membersData, billsData, statementsData, coverageData] = await Promise.all([
          getMembers(),
          getBills(),
          getStatements(),
          getCoverageMetrics()
        ]);
        
        setMembers(membersData.members);
        setBills(billsData.bills);
        setStatements(statementsData.statements);
        setCoverage(coverageData);
        setLastUpdated(membersData.lastUpdated);
        setDataSource(membersData.source);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
    if (loading) return;
    
    let data: string;
    let filename: string;
    let mimeType: string;
    const dateStr = new Date().toISOString().split('T')[0];

    if (format === "json") {
      mimeType = "application/json";
      const exportData: Record<string, unknown> = {};
      
      if (dataType === "statements" || dataType === "all") {
        exportData.statements = statements.map(s => ({
          ...s,
          memberName: members.find(m => m.bioguideId === s.bioguideId)?.name
        }));
      }
      if (dataType === "bills" || dataType === "all") {
        exportData.bills = bills.map(b => ({
          ...b,
          sponsorName: members.find(m => m.bioguideId === b.sponsorBioguideId)?.name
        }));
      }
      if (dataType === "members" || dataType === "all") {
        exportData.members = members;
      }
      if (dataType === "all") {
        exportData.topics = techTopics;
        exportData.exportedAt = new Date().toISOString();
        exportData.source = dataSource;
      }
      
      data = JSON.stringify(exportData, null, 2);
      filename = `capitol-pulse-${dataType}-${dateStr}.json`;
    } else {
      mimeType = "text/csv";
      
      if (dataType === "statements") {
        const headers = ["id", "title", "publishedAt", "memberName", "topics", "tone", "toneConfidence", "sourceUrl", "excerpt"];
        const csvData = statements.map(s => ({
          ...s,
          memberName: members.find(m => m.bioguideId === s.bioguideId)?.name
        }));
        data = generateCSV(csvData as unknown as Record<string, unknown>[], headers);
        filename = `capitol-pulse-statements-${dateStr}.csv`;
      } else if (dataType === "bills") {
        const headers = ["billId", "billType", "billNumber", "title", "topics", "introducedDate", "latestAction", "sponsorName", "url"];
        const csvData = bills.map(b => ({
          ...b,
          sponsorName: members.find(m => m.bioguideId === b.sponsorBioguideId)?.name
        }));
        data = generateCSV(csvData as unknown as Record<string, unknown>[], headers);
        filename = `capitol-pulse-bills-${dateStr}.csv`;
      } else if (dataType === "members") {
        const headers = ["bioguideId", "name", "chamber", "party", "state", "district", "officialUrl"];
        data = generateCSV(members as unknown as Record<string, unknown>[], headers);
        filename = `capitol-pulse-members-${dateStr}.csv`;
      } else {
        // For 'all', create a combined JSON
        const exportData = {
          statements: statements.map(s => ({
            ...s,
            memberName: members.find(m => m.bioguideId === s.bioguideId)?.name
          })),
          bills: bills.map(b => ({
            ...b,
            sponsorName: members.find(m => m.bioguideId === b.sponsorBioguideId)?.name
          })),
          members: members,
          topics: techTopics,
          exportedAt: new Date().toISOString(),
          source: dataSource
        };
        data = JSON.stringify(exportData, null, 2);
        filename = `capitol-pulse-all-${dateStr}.json`;
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

  const hasData = members.length > 0 || bills.length > 0 || statements.length > 0;
  const formattedDate = new Date(lastUpdated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="mx-auto max-w-4xl px-6">
        {/* Header */}
        <header className="mb-12">
          <ScrollReveal animation="fade-down">
            <Link href="/capitol-pulse" className="text-accent-blue hover:text-accent-blue/80 text-sm mb-4 inline-block">
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

        {/* Data Status */}
        <ScrollReveal animation="fade-up">
          <div className={`rounded-xl border p-4 mb-8 ${
            hasData ? "bg-emerald-500/10 border-emerald-500/20" : "bg-amber-500/10 border-amber-500/20"
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${hasData ? "bg-emerald-500" : "bg-amber-500"}`} />
                <span className={`text-sm font-medium ${hasData ? "text-emerald-400" : "text-amber-400"}`}>
                  {dataSource}
                </span>
              </div>
              <span className="text-white/40 text-sm">
                Updated: {formattedDate}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent-blue border-t-transparent" />
          </div>
        ) : !hasData ? (
          <ScrollReveal animation="fade-up">
            <div className="bg-navy-800/40 rounded-2xl border border-white/5 p-12 text-center">
              <span className="text-6xl mb-6 block">📥</span>
              <h2 className="text-2xl font-display font-bold text-white mb-4">
                No Data Available
              </h2>
              <p className="text-white/50 max-w-lg mx-auto mb-6">
                Connect to official data sources to enable data downloads.
                Data exports include official source URLs for all records.
              </p>
              <Link 
                href="/capitol-pulse/methodology"
                className="text-accent-blue hover:text-accent-blue/80"
              >
                Learn how to connect →
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          <>
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
                        { value: "statements", label: "Statements Only", desc: "Congressional Record excerpts" },
                        { value: "bills", label: "Bills Only", desc: "Tech legislation from Congress.gov" },
                        { value: "members", label: "Members Only", desc: "Current Congress roster" }
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setDataType(opt.value as DataType)}
                          className={`w-full p-4 rounded-xl text-left transition-all ${
                            dataType === opt.value 
                              ? "bg-accent-blue/20 border-2 border-accent-blue/50" 
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
                            ? "bg-accent-blue/20 border-2 border-accent-blue/50" 
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
                            ? "bg-accent-blue/20 border-2 border-accent-blue/50" 
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
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-blue to-accent-red text-white font-bold text-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-500 hover:scale-[1.02]"
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
                    <p className="text-3xl font-display font-bold text-accent-blue">{statements.length}</p>
                    <p className="text-white/40 text-sm">Statements</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <p className="text-3xl font-display font-bold text-accent-red">{bills.length}</p>
                    <p className="text-white/40 text-sm">Bills</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <p className="text-3xl font-display font-bold text-purple-400">{members.length}</p>
                    <p className="text-white/40 text-sm">Members</p>
                  </div>
                </div>
                
                <p className="text-white/40 text-sm text-center">
                  Data source: {dataSource}
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
                    <h3 className="text-accent-blue font-mono text-sm mb-2">Statement Object</h3>
                    <pre className="bg-black/30 rounded-xl p-4 text-white/70 text-sm overflow-x-auto">
{`{
  "id": "string",
  "bioguideId": "string",
  "memberName": "string",
  "title": "string",
  "excerpt": "string",
  "sourceUrl": "https://...",
  "sourceType": "congressional_record" | "press_release",
  "publishedAt": "YYYY-MM-DD",
  "topics": ["AI & Automation", ...],
  "tone": "Support" | "Concern" | "Neutral",
  "toneConfidence": 0-100,
  "matchedSnippet": "text that triggered tagging"
}`}
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="text-accent-red font-mono text-sm mb-2">Bill Object</h3>
                    <pre className="bg-black/30 rounded-xl p-4 text-white/70 text-sm overflow-x-auto">
{`{
  "billId": "119-hr-123",
  "congress": 119,
  "billType": "hr" | "s",
  "billNumber": 123,
  "title": "string",
  "summary": "string",
  "topics": ["Cybersecurity", ...],
  "introducedDate": "YYYY-MM-DD",
  "latestAction": "string",
  "sponsorBioguideId": "W000805",
  "sponsorName": "Mark Warner",
  "cosponsorCount": 12,
  "url": "https://congress.gov/...",
  "matchedSubjects": ["Computer security", ...]
}`}
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="text-purple-400 font-mono text-sm mb-2">Member Object</h3>
                    <pre className="bg-black/30 rounded-xl p-4 text-white/70 text-sm overflow-x-auto">
{`{
  "bioguideId": "W000805",
  "name": "Mark Warner",
  "firstName": "Mark",
  "lastName": "Warner",
  "chamber": "House" | "Senate",
  "party": "Democratic" | "Republican" | "Independent",
  "state": "VA",
  "district": 12,
  "officialUrl": "https://...",
  "imageUrl": "https://bioguide.congress.gov/..."
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Terms of Use */}
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="bg-gradient-to-br from-accent-blue/10 via-navy-800/50 to-accent-red/10 rounded-2xl border border-white/5 p-8">
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
                    <li>Verify official source URLs before republishing</li>
                  </ul>
                  
                  <p className="text-white/40">
                    The underlying source data (bills, Congressional Record) is public record. 
                    Every exported record includes an official source URL for verification.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </>
        )}
      </div>
    </div>
  );
}
