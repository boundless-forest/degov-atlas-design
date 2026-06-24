# Implementation Handoff — DeGov Atlas Redesign

## Files to Read

1. `DESIGN.md` — complete visual direction with YAML tokens and 9-section prose
2. `design-contract.md` — decision record, keep/change boundaries, quality gate
3. Current codebase:
   - `apps/atlas/app/globals.css` — all CSS custom properties and component styles
   - `apps/atlas/app/layout.tsx` — shell layout, sidebar, mobile nav
   - `apps/atlas/components/ui.tsx` — reusable component library
   - `apps/atlas/app/page.tsx` — homepage dashboard layout
   - All page files under `apps/atlas/app/` — detail pages

## Token / Palette / Type / Layout Constraints

- **Colors:** Use only tokens from the DESIGN.md YAML frontmatter. `primary` (#0b0b0b), `accent` (#111111), `secondary` (#5f6368), semantic green/red/amber, `line` (#dedede), `soft` (#f5f5f5), `neutral` (#ffffff)
- **Typography:** Inter only. h1 at clamp(2.1rem, 5vw, 4.3rem) with 0.94 line-height and -0.075em tracking. Body at 1rem/1.55. Eyebrow at 0.76rem with 0.04em tracking.
- **Spacing:** 8px baseline. Card gap 8px. Card padding 14px. Sidebar 244px.
- **Radius:** 7px (buttons, pills), 8px (cards, panels), 12px (brand mark)
- **Borders:** 1px solid `line` on every card and panel

## Asset Rules

- No images or illustrations needed — this is a data dashboard
- Brand mark: "D" letter in 44×44px dark square, 12px radius, weight 900
- Unicode icons for nav items (⌂ ◫ ↯ ✉) — replace with SVG icons if desired
- Chart components (activity-chart, vote-stack) are CSS-only — preserve this approach

## Responsive Requirements

- Desktop: 244px sidebar + fluid main content (CSS Grid `grid-template-columns: 244px minmax(0, 1fr)`)
- Mobile (<768px): Sidebar hidden, bottom tab bar visible with 4 nav items
- Cards: min-width 0 on all grid children to prevent overflow
- Tables: horizontal scroll on narrow viewports
- Headings: clamp() values ensure readability at all widths

## First Artifact Should Prove

1. The DESIGN.md tokens map correctly to CSS custom properties (`:root { --atlas-* }`)
2. A single page (homepage recommended) renders with the updated tokens while preserving all current component variants
3. All three states (loading, empty, error) work on at least one data-dependent view
4. No regression in mobile tab bar behavior
5. Information density is preserved — same number of visible cards/rows at desktop width

## Acceptance Notes

- Run `pnpm --dir apps/atlas typecheck` — zero errors
- Run `pnpm --dir apps/atlas test` — all existing tests pass
- Run `pnpm format:check` — no formatting violations
- Visual review: the refreshed design should feel like an evolution, not a replacement. Someone familiar with the current Atlas should recognize it immediately.
