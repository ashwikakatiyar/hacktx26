// Frontend mirror of the decisions locked at hour 0 (see api/lib/config.ts).
// Keep these two files in sync. Change the rule in both places.

export const VILLAGE = {
  thrivingMaxDays: 14, // <= 14 days since last hangout  -> thriving
  weatheredMaxDays: 56, // 15-56 days                     -> weathered; > 56 -> run-down
  rowSize: 4, // plots per row
  thrivingNeededToUnlockNextRow: 3, // keep 3 cottages thriving to unlock the next row
};

export type CottageState = "thriving" | "weathered" | "run-down";

export function cottageState(daysSince: number | null): CottageState {
  if (daysSince === null) return "run-down"; // never hung out
  if (daysSince <= VILLAGE.thrivingMaxDays) return "thriving";
  if (daysSince <= VILLAGE.weatheredMaxDays) return "weathered";
  return "run-down";
}

export const COTTAGE_LABEL: Record<CottageState, string> = {
  thriving: "Thriving",
  weathered: "Weathered",
  "run-down": "Run-down",
};

// Feature flags for the mock-data phase.
export const FLAGS = {
  // true = a fresh launch starts in onboarding. Profile > Preview onboarding can replay it.
  showOnboardingOnLaunch: true,
};

export const INVITE_LINK = "https://thevillagetable.tech/join/alex"; // placeholder until the real domain is wired in
