// Decisions locked at hour 0. Change them here, nowhere else.

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

// Event lifecycle: proposed -> confirmed -> happened
export const EVENT_STATUS = ["proposed", "confirmed", "happened"] as const;

// The demo "you". Real auth is cut; every request acts as this user unless a header says otherwise.
export const DEMO_USER_ID = 1;
