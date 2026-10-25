// Dropdown and chip options for onboarding. Only fields the planner uses are collected.

export const AGE_RANGES = ["18–24", "25–34", "35–44", "45+"] as const;
export const GENDERS = [
  "Woman",
  "Man",
  "Non-binary",
  "Prefer not to say",
] as const;
export const DISTANCES = ["2 mi", "5 mi", "10 mi", "25 mi", "25+ mi"] as const;

export const ACCESSIBILITY = [
  "Step-free access",
  "Quiet spaces",
  "Sensory-friendly",
  "Seating available",
  "Hearing support",
  "None right now",
] as const;
export const TRANSPORT = [
  "Car",
  "Public transit",
  "Bike",
  "Walking",
  "Rideshare",
] as const;
export const DIETARY = [
  "Vegetarian",
  "Vegan",
  "Halal",
  "Kosher",
  "Gluten-free",
  "Nut allergy",
  "No restrictions",
] as const;

// Choosing one of these clears the other options in the same list.
export const EXCLUSIVE: Record<string, string> = {
  accessibility: "None right now",
  dietary: "No restrictions",
};

export const INTEREST_BUCKETS = [
  {
    title: "Cozy and quiet",
    dot: "#CBB8F5",
    options: ["Cozy cafes", "Bookshops", "Tea houses", "Spa days"],
  },
  {
    title: "Out in the wild",
    dot: "#B9E0C9",
    options: [
      "Sunset hikes",
      "Picnics",
      "Kayaking",
      "Stargazing",
      "Farmers markets",
    ],
  },
  {
    title: "Food and drink",
    dot: "#F6DE9A",
    options: [
      "Brunch",
      "Dessert crawls",
      "Cooking class",
      "Food trucks",
      "Mocktail bars",
    ],
  },
  {
    title: "Arts and making",
    dot: "#F4C6D6",
    options: ["Pottery", "Museums", "Paint night", "Craft workshops"],
  },
  {
    title: "Games and play",
    dot: "#CBB8F5",
    options: ["Board games", "Mini-golf", "Arcades", "Bowling", "Escape rooms"],
  },
  {
    title: "Music and nights out",
    dot: "#B9E0C9",
    options: ["Live music", "Karaoke", "Comedy nights", "Dancing"],
  },
] as const;

export const FREQUENCIES = [
  { label: "Weekly", days: 7 },
  { label: "Every 2 weeks", days: 14 },
  { label: "Monthly", days: 30 },
] as const;
