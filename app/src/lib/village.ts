import { VILLAGE, cottageState, type CottageState } from "@/lib/config";
import { plural } from "@/lib/dates";

// What the village endpoint will return per friend. Note there is deliberately no attendee list:
// the cottage detail only ever shows outings you and this friend did together.
export type VillageFriend = {
  id: number;
  name: string;
  avatarUrl: string | null;
  tint: string;
  daysSince: number | null; // days since you last hung out (happened events only)
  hangoutCount: number;
  outings: { id: number; name: string; type: string; daysAgo: number }[]; // shared outings only
  sharedGroupId: number | null;
};

export type VillageCell = { kind: "friend"; friend: VillageFriend; state: CottageState } | { kind: "open" };

export type VillageRow =
  | { locked: false; index: number; title: string; sub: string; cells: VillageCell[] }
  | { locked: true; index: number; title: string; sub: string; lockText: string };

export type Village = { rows: VillageRow[]; summary: string; thrivingCount: number; unlockedRows: number };

export function buildVillage(friends: VillageFriend[]): Village {
  const size = VILLAGE.rowSize;
  const need = VILLAGE.thrivingNeededToUnlockNextRow;
  const n = friends.length;
  const withState = friends.map((friend) => ({ friend, state: cottageState(friend.daysSince) }));
  const thrivingCount = withState.filter((f) => f.state === "thriving").length;

  // Every friend must be visible, so rows holding friends are always unlocked.
  // A completely full last row unlocks one more row when enough cottages are Thriving.
  let unlockedRows = Math.max(1, Math.ceil(n / size));
  while (unlockedRows * size === n && thrivingCount >= need) unlockedRows++;

  const rows: VillageRow[] = [];
  for (let r = 0; r < unlockedRows; r++) {
    const cells: VillageCell[] = [];
    for (let k = 0; k < size; k++) {
      const entry = withState[r * size + k];
      cells.push(entry ? { kind: "friend", ...entry } : { kind: "open" });
    }
    const filled = cells.filter((c) => c.kind === "friend").length;
    rows.push({ locked: false, index: r, title: `Row ${r + 1}`, sub: `${filled} of ${size} plots filled`, cells });
  }

  const openPlots = unlockedRows * size - n;
  rows.push({
    locked: true,
    index: unlockedRows,
    title: `Row ${unlockedRows + 1}`,
    sub: "Locked",
    lockText:
      openPlots > 0
        ? `Fill your open plots and keep ${need} cottages Thriving to unlock this row.`
        : `Keep ${need} cottages Thriving to unlock this row (${thrivingCount} of ${need} right now).`,
  });

  return { rows, summary: `${plural(n, "friend")} · ${plural(unlockedRows, "row")} unlocked`, thrivingCount, unlockedRows };
}
