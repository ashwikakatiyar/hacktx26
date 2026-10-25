export const GROUP_TIME_ZONE = "America/Chicago";

export function formatAustinTime(isoUtc: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: GROUP_TIME_ZONE, dateStyle: "medium", timeStyle: "short" }).format(new Date(isoUtc));
}

// Accept a wall-clock value from <input type="datetime-local"> (YYYY-MM-DDTHH:mm).
// Reject nonexistent or ambiguous DST times instead of silently shifting them.
export function austinLocalToUtc(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error("Use local datetime YYYY-MM-DDTHH:mm (no Z or offset)");
  const [, y, mo, d, h, mi] = match;
  const target = `${y}-${mo}-${d}T${h}:${mi}`;
  const base = Date.UTC(+y, +mo - 1, +d, +h, +mi);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: GROUP_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  const matches: number[] = [];
  for (let offsetMinutes = -12 * 60; offsetMinutes <= 14 * 60; offsetMinutes += 15) {
    const instant = base - offsetMinutes * 60_000;
    const parts = Object.fromEntries(formatter.formatToParts(new Date(instant)).map(p => [p.type, p.value]));
    if (`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}` === target) matches.push(instant);
  }
  if (matches.length !== 1) throw new Error(matches.length ? "Ambiguous local time during daylight-saving transition; choose another time" : "Invalid or nonexistent Austin local time");
  return new Date(matches[0]).toISOString();
}
