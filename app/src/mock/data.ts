// Mock data for the Phase 2 screens, so the UI runs without the server.
// It mirrors api/db/seed.sql (same people, groups, cards and "days since" spread) so swapping in
// real API calls later is a data-source change, not a UI change.
import { inDays } from "@/lib/dates";
import type { VillageFriend } from "@/lib/village";
import type { ImageSourcePropType } from "react-native";

export type Person = {
  id: number;
  name: string;
  avatarUrl: string | null;
  avatarSource?: ImageSourcePropType | null;
  tint: string;
};

// These local assets are the four uploaded profile photos, in upload order.
const PROFILE_PHOTOS: Record<number, ImageSourcePropType> = {
  1: require("../../assets/avatars/alex.jpg"),
  2: require("../../assets/avatars/sam.jpg"),
  3: require("../../assets/avatars/priya.jpg"),
  4: require("../../assets/avatars/jordan.jpg"),
};
const PROFILE_PHOTO_URLS: Record<number, string> = {
  1: "/avatars/alex.jpg",
  2: "/avatars/sam.jpg",
  3: "/avatars/priya.jpg",
  4: "/avatars/jordan.jpg",
};

const p = (
  id: number,
  name: string,
  tint: string,
): Person => ({
  id,
  name,
  tint,
  avatarUrl: PROFILE_PHOTO_URLS[id] ?? null,
  avatarSource: PROFILE_PHOTOS[id] ?? null,
});

export const ME: Person = p(1, "Alex", "#E3B04B");

export const PEOPLE: Record<number, Person> = {
  1: ME,
  2: p(2, "Sam", "#F6DE9A"),
  3: p(3, "Priya", "#F4C6D6"),
  4: p(4, "Jordan", "#B9E0C9"),
  5: p(5, "Marcus", "#CBB8F5"),
  6: p(6, "Dani", "#F4C6D6"),
  7: p(7, "Riley", "#B9E0C9"),
  8: p(8, "Kai", "#B9E0C9"),
  9: p(9, "Mei", "#CBB8F5"),
  10: p(10, "Theo", "#F6DE9A"),
};

export const PIXIE_NEW_IDEAS = 3;

// ---------- Groups and ideas (cards) ----------

export type Group = {
  id: number;
  name: string;
  memberIds: number[]; // includes you
  freqDays: 7 | 14 | 30; // friendship goal: how often we want to meet
  interests: string[];
};

export const GROUPS: Group[] = [
  {
    id: 1,
    name: "Austin Crew",
    memberIds: [1, 2, 3, 4, 5],
    freqDays: 14,
    interests: ["Food", "Live music", "Cozy cafes"],
  },
  {
    id: 2,
    name: "Study Break",
    memberIds: [1, 2, 4],
    freqDays: 14,
    interests: ["Coffee", "Board games"],
  },
  {
    id: 3,
    name: "Weekend Crew",
    memberIds: [1, 6, 7, 8],
    freqDays: 30,
    interests: ["Outdoors", "Climbing", "Sunset hikes"],
  },
];

export type IdeaSource = "pixie" | "text" | "screenshot" | "chat";

export type Idea = {
  id: number;
  groupId: number;
  name: string;
  priceLevel: number | null; // 1..4
  activityType: string;
  address: string;
  imageUrl: string | null;
  source: IdeaSource;
  sourceBy: number | null; // person id for text / screenshot / chat
};

export const IDEAS: Idea[] = [
  {
    id: 1,
    groupId: 1,
    name: "Ramen Tatsu-Ya",
    priceLevel: 2,
    activityType: "dinner",
    address: "8557 Research Blvd, Austin, TX",
    imageUrl: null,
    source: "text",
    sourceBy: 1,
  },
  {
    id: 2,
    groupId: 1,
    name: "Bouldin Creek Café",
    priceLevel: 2,
    activityType: "dinner",
    address: "1900 S 1st St, Austin, TX",
    imageUrl: null,
    source: "text",
    sourceBy: 2,
  },
  {
    id: 3,
    groupId: 1,
    name: "Barton Springs Pool",
    priceLevel: 1,
    activityType: "outdoors",
    address: "2131 William Barton Dr, Austin, TX",
    imageUrl: null,
    source: "screenshot",
    sourceBy: 3,
  },
  {
    id: 4,
    groupId: 1,
    name: "Odd Duck",
    priceLevel: 3,
    activityType: "dinner",
    address: "1201 S Lamar Blvd, Austin, TX",
    imageUrl: null,
    source: "text",
    sourceBy: 5,
  },
  {
    id: 5,
    groupId: 1,
    name: "Mozart’s Coffee Roasters",
    priceLevel: 2,
    activityType: "coffee",
    address: "3825 Lake Austin Blvd, Austin, TX",
    imageUrl: null,
    source: "screenshot",
    sourceBy: 4,
  },
  {
    id: 6,
    groupId: 1,
    name: "Continental Club",
    priceLevel: 2,
    activityType: "music",
    address: "1315 S Congress Ave, Austin, TX",
    imageUrl: null,
    source: "pixie",
    sourceBy: null,
  },
  {
    id: 7,
    groupId: 2,
    name: "Mozart’s Coffee Roasters",
    priceLevel: 2,
    activityType: "coffee",
    address: "3825 Lake Austin Blvd, Austin, TX",
    imageUrl: null,
    source: "screenshot",
    sourceBy: 4,
  },
  {
    id: 8,
    groupId: 3,
    name: "Austin Bouldering Project",
    priceLevel: 2,
    activityType: "outdoors",
    address: "979 Springdale Rd, Austin, TX",
    imageUrl: null,
    source: "text",
    sourceBy: 6,
  },
];

// ---------- Confirmed plans (home + profile) ----------

export type EventItem = {
  id: number;
  title: string;
  groupId: number;
  priceLevel: number | null;
  activityType: string;
  address: string;
  imageUrl: string | null;
  startsAt: Date;
  status: "confirmed";
};

export const EVENTS: EventItem[] = [
  {
    id: 1,
    title: "Ramen Tatsu-Ya",
    groupId: 1,
    priceLevel: 2,
    activityType: "dinner",
    address: "8557 Research Blvd, Austin, TX",
    imageUrl: null,
    startsAt: inDays(6, 19, 0),
    status: "confirmed",
  },
  {
    id: 2,
    title: "Mozart’s Coffee Roasters",
    groupId: 2,
    priceLevel: 2,
    activityType: "coffee",
    address: "3825 Lake Austin Blvd, Austin, TX",
    imageUrl: null,
    startsAt: inDays(15, 16, 0),
    status: "confirmed",
  },
];

// ---------- Village (friends and shared outings) ----------
// Days since last hangout matches the backend seed: thriving 3/3/6/10, weathered 28/35/49, run-down 90/140.

const friend = (
  id: number,
  daysSince: number,
  outings: [string, string, number][],
  sharedGroupId: number | null,
): VillageFriend => {
  const person = PEOPLE[id];
  return {
    id,
    name: person.name,
    avatarUrl: person.avatarUrl,
    avatarSource: person.avatarSource,
    tint: person.tint,
    daysSince,
    hangoutCount: outings.length,
    outings: outings.map(([name, type, daysAgo], i) => ({
      id: id * 10 + i,
      name,
      type,
      daysAgo,
    })),
    sharedGroupId,
  };
};

export const VILLAGE_FRIENDS: VillageFriend[] = [
  friend(
    2,
    3,
    [
      ["Coffee + games", "Games", 3],
      ["Ramen night", "Dinner", 365],
    ],
    1,
  ),
  friend(
    4,
    3,
    [
      ["Coffee + games", "Games", 3],
      ["Ramen night", "Dinner", 365],
    ],
    2,
  ),
  friend(
    3,
    35,
    [
      ["Sunset swim", "Outdoors", 35],
      ["Ramen night", "Dinner", 365],
    ],
    1,
  ),
  friend(
    5,
    10,
    [
      ["Dinner at Odd Duck", "Dinner", 10],
      ["Ramen night", "Dinner", 365],
    ],
    1,
  ),
  friend(7, 6, [["Taco night", "Dinner", 6]], 3),
  friend(8, 28, [["Karaoke", "Music", 28]], 3),
  friend(9, 49, [["Brunch", "Brunch", 49]], null),
  friend(6, 90, [["Climbing night", "Outdoors", 90]], 3),
  friend(10, 140, [["Game night", "Games", 140]], null),
];

// ---------- Profile: spending and what you owe ----------

export const SPENDING = {
  periodLabel: "Last 6 months",
  months: [
    { label: "May", amount: 48 },
    { label: "Jun", amount: 72 },
    { label: "Jul", amount: 35 },
    { label: "Aug", amount: 90 },
    { label: "Sep", amount: 64 },
    { label: "Oct", amount: 41 }, // this month so far
  ],
};

export type Owe = { id: number; personId: number; why: string; amount: number };

export const OWES: Owe[] = [
  { id: 1, personId: 5, why: "Dinner at Odd Duck", amount: 28 },
  { id: 2, personId: 2, why: "Coffee + games", amount: 11.67 },
  { id: 3, personId: 3, why: "Sunset swim", amount: 10 },
];

// ---------- People you could invite (onboarding step 4, invite screen) ----------

export type Contact = { person: Person; onApp: boolean };

export const CONTACTS: Contact[] = [
  { person: PEOPLE[5], onApp: false },
  { person: PEOPLE[4], onApp: false },
  { person: PEOPLE[3], onApp: true },
  { person: PEOPLE[2], onApp: true },
];

export const groupById = (id: number) => GROUPS.find((g) => g.id === id);
export const ideasForGroup = (groupId: number) =>
  IDEAS.filter((i) => i.groupId === groupId);
