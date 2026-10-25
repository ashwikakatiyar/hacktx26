# Figma handoff — October 2026

Reference PNGs are in `design-reference/` (11 screens).

## Implemented in this pass
- Updated shared color tokens to the exported storybook palette.
- Updated onboarding form/card/button surfaces to cream with brown borders and lavender CTAs.
- Updated bottom navigation surface to cream and renamed the Village tab label to Circles to match Figma (route remains `/village`).
- Preserved existing navigation, forms, mock data and API integration code.

## Still needed for pixel-perfect implementation
- Original transparent Pixie artwork (the exported screen raster is not an isolated sprite).
- Exact font family/font files or font name.
- Individual venue imagery if these should be real images rather than existing placeholders.
- Detailed layout and behavior pass on each of the 11 screens; reference PNGs are not interactive code.

## Run
`cd app && npm install && npx expo start`

Do not use the PNG screenshots as screen backgrounds: all forms and buttons must remain accessible and interactive.
