"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { Member } from "@/lib/capitol-pulse/congress";
import { PARTY_NAMES, PartyCode, STATES, TERRITORIES } from "@/lib/capitol-pulse/format";
import { Card, EmptyState, PartyTag } from "./ui";

export interface MemberWithActivity extends Member {
  techSponsored: number;
  techAdvanced: number;
}

const STATE_OPTIONS = Object.entries(STATES).sort((a, b) => a[1].localeCompare(b[1]));
const selectCls = "rounded-lg border border-white/15 bg-navy-900 px-3 py-2 text-sm text-white focus:border-accent-blue focus:outline-none";

function MemberCard({ m }: { m: MemberWithActivity }) {
  const role = m.chamber === "Senate" ? "Senator" : m.isDelegate ? "Delegate" : "Representative";
  return (
    <Link href={`/capitol-pulse/members/${m.bioguideId}`} className="group">
      <Card className="flex h-full items-center gap-4 p-4 transition-colors group-hover:border-white/25 group-hover:bg-white/[0.06]">
        {m.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.imageUrl} alt="" loading="lazy" className="h-14 w-14 shrink-0 rounded-full object-cover object-top bg-white/10" />
        ) : (
          <div className="h-14 w-14 shrink-0 rounded-full bg-white/10" />
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-white group-hover:text-accent-blue">{m.name}</div>
          <div className="text-xs text-white/50">
            {role} · <PartyTag party={m.party} state={m.state} district={m.district} />
          </div>
          <div className="mt-1 text-xs text-white/60">
            {m.techSponsored ? (
              <>
                <span className="text-white">{m.techSponsored}</span> tech bill{m.techSponsored === 1 ? "" : "s"} written
                {m.techAdvanced ? <> · <span className="text-emerald-300">{m.techAdvanced} advancing</span></> : null}
              </>
            ) : (
              <span className="text-white/40">No tech bills written yet</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function MemberFinder({ members, initialState }: { members: MemberWithActivity[]; initialState: string }) {
  const pathname = usePathname();
  const [state, setState] = useState(initialState);
  const [q, setQ] = useState("");
  const [chamber, setChamber] = useState<"" | "House" | "Senate">("");
  const [party, setParty] = useState<"" | PartyCode>("");
  const [sort, setSort] = useState<"activity" | "name">("activity");

  useEffect(() => {
    window.history.replaceState(null, "", state ? `${pathname}?state=${state}` : pathname);
  }, [state, pathname]);

  const mine = useMemo(() => {
    if (!state) return null;
    const inState = members.filter((m) => m.state === state);
    return {
      senators: inState.filter((m) => m.chamber === "Senate"),
      reps: inState.filter((m) => m.chamber === "House").sort((a, b) => (a.district ?? 0) - (b.district ?? 0))
    };
  }, [members, state]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return members
      .filter((m) => (!state || m.state !== state) && (!chamber || m.chamber === chamber) && (!party || m.party === party) && (!needle || `${m.name} ${STATES[m.state] ?? ""}`.toLowerCase().includes(needle)))
      .sort((a, b) => (sort === "name" ? a.sortName.localeCompare(b.sortName) : b.techSponsored - a.techSponsored || b.techAdvanced - a.techAdvanced));
  }, [members, state, q, chamber, party, sort]);

  const counts = useMemo(() => {
    const voting = members.filter((m) => !m.isDelegate);
    return { senate: voting.filter((m) => m.chamber === "Senate").length, house: voting.filter((m) => m.chamber === "House").length, delegates: members.length - voting.length };
  }, [members]);

  return (
    <div className="space-y-12">
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_18rem] md:items-center">
          <div>
            <h2 className="font-display font-semibold text-white text-lg">Who represents you?</h2>
            <p className="text-sm text-white/50 mt-1">
              Everyone has two senators and one House member. Pick your state to see yours.{" "}
              <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">
                Not sure of your district? Look it up by ZIP ↗
              </a>
            </p>
          </div>
          <select value={state} onChange={(e) => setState(e.target.value)} className={`${selectCls} py-3 text-base`} aria-label="Your state">
            <option value="">Choose your state…</option>
            <optgroup label="States">
              {STATE_OPTIONS.filter(([c]) => !TERRITORIES.has(c)).map(([c, n]) => (
                <option key={c} value={c}>{n}</option>
              ))}
            </optgroup>
            <optgroup label="DC & territories">
              {STATE_OPTIONS.filter(([c]) => TERRITORIES.has(c)).map(([c, n]) => (
                <option key={c} value={c}>{n}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </Card>

      {mine && (
        <section className="space-y-8">
          <div>
            <h2 className="text-xl font-display font-bold text-white mb-4">
              {TERRITORIES.has(state) ? `${STATES[state]}'s delegate` : `Senators from ${STATES[state]}`}
            </h2>
            {mine.senators.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {mine.senators.map((m) => (
                  <MemberCard key={m.bioguideId} m={m} />
                ))}
              </div>
            ) : TERRITORIES.has(state) ? null : (
              <p className="text-white/50 text-sm">No current senators found.</p>
            )}
            {TERRITORIES.has(state) && mine.reps.length > 0 && (
              <p className="text-sm text-white/50 -mt-2 mb-3">DC and U.S. territories have no senators and a non-voting delegate in the House.</p>
            )}
          </div>
          {mine.reps.length > 0 && (
            <div>
              {!TERRITORIES.has(state) && (
                <h2 className="text-xl font-display font-bold text-white mb-4">
                  {STATES[state]}&apos;s {mine.reps.length} House member{mine.reps.length === 1 ? "" : "s"}
                </h2>
              )}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {mine.reps.map((m) => (
                  <MemberCard key={m.bioguideId} m={m} />
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xl font-display font-bold text-white">{mine ? "Everyone else in Congress" : "All of Congress"}</h2>
            <p className="text-sm text-white/50 mt-1">
              {counts.senate} senators, {counts.house} representatives and {counts.delegates} non-voting delegates currently serving.
            </p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] mb-5">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or state…"
            aria-label="Search lawmakers"
            className="rounded-lg border border-white/15 bg-navy-900 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:border-accent-blue focus:outline-none"
          />
          <select value={chamber} onChange={(e) => setChamber(e.target.value as typeof chamber)} className={selectCls} aria-label="Chamber">
            <option value="">House & Senate</option>
            <option value="Senate">Senate</option>
            <option value="House">House</option>
          </select>
          <select value={party} onChange={(e) => setParty(e.target.value as typeof party)} className={selectCls} aria-label="Party">
            <option value="">All parties</option>
            {(["D", "R", "I"] as PartyCode[]).map((p) => (
              <option key={p} value={p}>{PARTY_NAMES[p]}s</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={selectCls} aria-label="Sort">
            <option value="activity">Most tech bills</option>
            <option value="name">Name (A–Z)</option>
          </select>
        </div>
        {list.length === 0 ? (
          <EmptyState title="No lawmakers match">Try a different name or clear the filters.</EmptyState>
        ) : (
          <MemberGrid members={list} />
        )}
      </section>
    </div>
  );
}

function MemberGrid({ members }: { members: MemberWithActivity[] }) {
  const [shown, setShown] = useState(30);
  useEffect(() => setShown(30), [members]);
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.slice(0, shown).map((m) => (
          <MemberCard key={m.bioguideId} m={m} />
        ))}
      </div>
      {shown < members.length && (
        <div className="mt-6 text-center">
          <button onClick={() => setShown((n) => n + 60)} className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-white hover:bg-white/5">
            Show more ({members.length - shown} left)
          </button>
        </div>
      )}
    </>
  );
}
