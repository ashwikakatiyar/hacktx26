// Thin client for the Village Table API (api/ folder). Set EXPO_PUBLIC_API_URL in app/.env.
// On a phone this must be your laptop's LAN IP (not localhost) or the deployed .tech URL.
export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export type Card = {
  id: number;
  created_by_name: string | null;
  name: string;
  activity_type: string | null;
  address: string | null;
  image_url: string | null;
  price_level: number | null;
  rating: number | null;
  dietary_tags: string[];
  source: string | null;
  needs_review: boolean;
  shared_groups: string[];
};

export type Group = {
  id: number;
  name: string;
  card_count: number;
  members: { id: number; name: string; avatar_url: string | null }[];
};

export type CreateResult = {
  card: Card;
  meta: { ms: { total: number }; fallbacks: string[]; errors: string[] };
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    });
  } catch {
    throw new Error(
      `Can't reach the API at ${API_URL}. Is it running, and is EXPO_PUBLIC_API_URL set to your computer's address?`,
    );
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listCards: (groupId?: number) =>
    request<{ cards: Card[] }>(
      `/api/cards${groupId ? `?group_id=${groupId}` : ""}`,
    ).then((r) => r.cards),
  getCard: (id: number) =>
    request<{ card: Card }>(`/api/cards/${id}`).then((r) => r.card),
  listGroups: () =>
    request<{ groups: Group[] }>("/api/groups").then((r) => r.groups),
  createCard: (body: {
    text?: string;
    image_base64?: string;
    mime_type?: string;
    group_ids?: number[];
  }) =>
    request<CreateResult>("/api/cards", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  updateCard: (
    id: number,
    patch: Partial<
      Pick<
        Card,
        "name" | "activity_type" | "address" | "image_url" | "price_level"
      >
    >,
  ) =>
    request<{ card: Card }>(`/api/cards/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }).then((r) => r.card),
};
