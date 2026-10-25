# Frontend Phase 2 (role C): screens on mock data

These screens run with **no server**. All data comes from `src/mock/data.ts`, which mirrors `api/db/seed.sql`
(same people, groups, cards, and "days since last hangout" spread), so wiring the API later is a data-source swap.

## One-time setup

The cottage and chart art uses `react-native-svg` (included in Expo Go). Install the SDK-matched version:

```bash
cd app
npx expo install react-native-svg
npx expo start     # route types regenerate on start (typedRoutes is on)
```

## Screens

| Route | File | Notes |
| --- | --- | --- |
| Home tab | `src/app/(tabs)/index.tsx` | Confirmed event cards + circle (group) cards |
| Village tab | `src/app/(tabs)/village.tsx` | Rows of 4 plots, cottage + profile photo, detail card, locked row, legend |
| Pixie tab | `src/app/(tabs)/pixie.tsx` | "Make your fairy": wings, dress, hair, name. Saved in memory only (`src/lib/fairy.ts`), so it resets on reload |
| Profile tab | `src/app/(tabs)/profile.tsx` | Confirmed plans, spending chart, what you owe. Gear icon replays onboarding |
| Group page | `src/app/group/[id].tsx` | Friendship goals, "Ask Pixie", ideas with source tags |
| Onboarding | `src/app/onboarding.tsx` | 4 steps. Dropdowns for single/multi choice fields, interest buckets as chips |
| Invite | `src/app/invite.tsx` | One screen for group page, open plots, and "+ New circle" |

Set `FLAGS.showOnboardingOnLaunch = true` in `src/lib/config.ts` to start fresh launches in onboarding.

The bottom bar (`src/components/AppTabBar.tsx`) reads the current route from expo-router rather than navigator props.
The fairy's name shows up on Home, the group page, onboarding and the tab label.

## Cottages

Three states (thriving, weathered, run-down) in `src/components/Cottage.tsx`, with the friend's profile photo on top
(`CottagePlot.tsx`; photo falls back to an initial when offline). Standalone copies for design handoff are in `assets/cottages/*.svg`.
State thresholds and the row-unlock rule live in `src/lib/config.ts` and mirror `api/lib/config.ts`. Change both together.

## Swapping to the real API later

- `src/lib/village.ts` already takes the shape the village endpoint is specified to return (no attendee lists, by design).
- Replace the imports from `@/mock/data` in each screen with `api.*` calls. Card/idea fields line up with `Card` in `src/lib/api.ts`.
- Phase 1 screens (`add.tsx`, `card/[id].tsx`) still use the real API and now pick up the new palette.

## Stand-ins to replace in later phases

- "Ask Pixie what to do" on the group page shows a placeholder alert (planner is Phase 3).
- "Plan something with [name]" opens your shared circle; it should open the planner for the pair.
- "Pay" on Profile marks an item paid locally (Nessie is Phase 4). Calendar "Connect" is a local toggle.
