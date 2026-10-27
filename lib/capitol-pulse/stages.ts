// Where a bill is in the legislative process, derived from the text of its
// official actions on Congress.gov. Ordered from earliest to furthest along.

export type Stage = "introduced" | "committee" | "passed-one" | "passed-both" | "to-president" | "law";

export const STAGES: { id: Stage; label: string; short: string; description: string }[] = [
  { id: "introduced", label: "Introduced", short: "Introduced", description: "Filed and sent to a committee, which hasn't acted on it yet. Most bills stop here." },
  { id: "committee", label: "Out of committee", short: "Committee", description: "A committee approved it (or it was placed on the calendar), so it can get a floor vote." },
  { id: "passed-one", label: "Passed one chamber", short: "Passed 1", description: "Passed the House or the Senate and now waits on the other chamber." },
  { id: "passed-both", label: "Passed both chambers", short: "Passed 2", description: "Passed the House and Senate; differences may still need to be resolved." },
  { id: "to-president", label: "Sent to President", short: "President", description: "On the President's desk to sign or veto." },
  { id: "law", label: "Became law", short: "Law", description: "Signed into law (or enacted over a veto)." }
];

export const STAGE_INDEX: Record<Stage, number> = Object.fromEntries(
  STAGES.map((s, i) => [s.id, i])
) as Record<Stage, number>;

export const STAGE_STYLE: Record<Stage, string> = {
  introduced: "bg-white/10 text-white/60",
  committee: "bg-amber-500/15 text-amber-300",
  "passed-one": "bg-sky-500/15 text-sky-300",
  "passed-both": "bg-indigo-500/20 text-indigo-300",
  "to-president": "bg-fuchsia-500/15 text-fuchsia-300",
  law: "bg-emerald-500/20 text-emerald-300"
};

function stageOfAction(text: string, originChamber: "House" | "Senate"): Stage {
  const t = text.toLowerCase();
  if (/became public law|signed by president|became law/.test(t)) return "law";
  if (/presented to president|vetoed|pocket veto/.test(t)) return "to-president";
  if (/resolving differences|conference report|cleared for white house/.test(t)) return "passed-both";

  const passedHouse = /passed house|passed\/agreed to in house|agreed to in house|received in the senate|message on house action/.test(t);
  const passedSenate = /passed senate|passed\/agreed to in senate|agreed to in senate|received in the house|message on senate action/.test(t);
  // A chamber can only take up the other chamber's bill after its origin chamber passed it
  if ((originChamber === "House" && passedSenate && !/received in the house/.test(t)) ||
      (originChamber === "Senate" && passedHouse && !/received in the senate/.test(t))) {
    return "passed-both";
  }
  if (passedHouse || passedSenate) return "passed-one";

  if (/reported by|ordered to be reported|reported with|reported without|placed on .*calendar|discharged/.test(t)) return "committee";
  return "introduced";
}

export function stageFromActions(actionTexts: string[], originChamber: "House" | "Senate"): Stage {
  let best: Stage = "introduced";
  for (const text of actionTexts) {
    const s = stageOfAction(text || "", originChamber);
    if (STAGE_INDEX[s] > STAGE_INDEX[best]) best = s;
  }
  return best;
}

export function isAdvanced(stage: Stage): boolean {
  return STAGE_INDEX[stage] >= STAGE_INDEX.committee;
}
