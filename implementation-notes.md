# Implementation notes — DeGov Atlas xAI redesign

## Scope

Full xAI dark design system rewrite of the Atlas multi-page static prototype. All 8 pages + `atlas.css` now use the xAI brutalist dark theme: `#1f2228` canvas, GeistMono monospace display, universalSans body, zero shadows, zero gradients, near-zero radii, white-on-dark opacity hierarchy.

## What changed

- **`atlas.css`** — complete rewrite. Replaced light DeFiLlama-inspired tokens with xAI dark design tokens. Key changes:
  - Background: `#ffffff` → `#1f2228`
  - Text: near-black ink → white opacity hierarchy (100/70/50/30%)
  - Display font: Inter 700 → GeistMono 300
  - Body font: Arial/Helvetica/system → universalSans
  - Buttons: GeistMono uppercase, 1.4px letter-spacing, 0px radius
  - Hover behavior: reversed — hover dims to 0.5 opacity instead of brightening
  - Borders: `rgba(255,255,255,0.1)` instead of `#dedede`
  - Radii: 0px everywhere (brutalist precision)
  - Shadows: none (depth through opacity-based borders and typographic contrast)
  - Status colors: brighter on dark bg (green `#4ade80`, red `#f87171`, amber `#fbbf24`)
  - Focus ring: blue only for accessibility (`rgb(59,130,246)/0.5`)
  - Sidebar: `#1f2228` background, active nav = white bg + dark text
  - Brand mark: white bg + `#1f2228` monospace letter
  - Eyebrow/sidebar-label: GeistMono uppercase, 1px letter-spacing

- **8 HTML pages** — content and structure preserved; visual changes come entirely from CSS. No changes to shell markup or route links.

## Route-to-file mapping

| Atlas route | Static prototype file | Notes |
|---|---|---|
| `/` | `index.html` | Overview with xAI dark shell, GeistMono hero headline, trend chart, Popular DAOs/Discussions panels |
| `/daos` | `dao-list.html` | DAO directory with inline filter bar, stats bar, expanded data table |
| `/daos/[daoId]` | `daos-detail.html` | DAO profile with summary panel, sparkline, forum/source cards, proposal list |
| `/governance` | `governance-feed.html` | Bulletin-style proposal feed with timeline, status pills |
| `/proposals/[proposalId]` | `proposal-detail.html` | Proposal detail with vote distribution bars, evidence table, participant links |
| `/newsletters` | `newsletters-list.html` | Single-line scrollable archive list |
| `/newsletters/[slug]` | `newsletter-detail.html` | Structured newsletter with masthead metrics, editor picks, DAO spotlights |
| `/participants/[participantId]` | `participant-detail.html` | Participant profile with stance distribution, DAO affiliations, vote table |

## Clickability contract

Unchanged from prior run — all route links map as above. Sidebar nav active states set per page.

## Design system tokens (xAI)

```css
--atlas-bg:           #1f2228;   /* warm near-black canvas — NEVER #000 */
--atlas-ink:          #ffffff;   /* pure white as "the voice" */
--atlas-muted:        rgba(255,255,255,0.7);   /* secondary text */
--atlas-subtle:       rgba(255,255,255,0.5);   /* tertiary/captions */
--atlas-line:         rgba(255,255,255,0.1);   /* card borders */
--atlas-soft:         rgba(255,255,255,0.05);  /* subtle backgrounds */
--atlas-panel:        rgba(255,255,255,0.03);  /* card surfaces */
--atlas-accent:       #ffffff;   /* primary CTAs — white IS the accent */
--atlas-blue:         #60a5fa;   /* links/chart lines (brightened for dark) */
--atlas-green:        #4ade80;   /* fresh/active/passed states */
--atlas-red:          #f87171;   /* failed/stale/degraded states */
--atlas-amber:        #fbbf24;   /* partial/ending-soon states */
--atlas-font:         universalSans stack;
--atlas-mono:         GeistMono stack;
--atlas-radius:       0px;
```

## Implementation handoff notes

- **CSS class architecture preserved** — all component selectors (`.panel`, `.data-row`, `.state-pill`, `.button`, `.metric-card`, etc.) keep the same names; only token values changed. Porting to Next.js requires updating `globals.css` token values only.
- **No HTML changes needed for the shell** — the same sidebar, topbar, and mobile tab bar markup renders xAI-dark through CSS alone.
- **Typography requires font loading** — GeistMono and universalSans must be loaded (CDN or self-hosted) in the Next.js layout for the monospace display aesthetic.
- **Button markup conventions change** — production `.button` and `.button.dark` classes now render GeistMono uppercase with 1.4px letter-spacing. Labels should be short and commanding.
- **Sample values** remain marked as sample/preview. Replace with API data during production implementation.
- **Component semantics** unchanged: `StatePill`, `MetricCard`, `DaoCard`, `ProposalCard`, `VoteDistribution`, `EmptyState`, `LoadingSkeleton`, `ErrorState`, `CaveatBox`, `PageIntro`.

## Final summary

The project is now fully xAI dark-themed. Compared with the prior light DeFiLlama-inspired run, this pass replaces `atlas.css` with a complete xAI brutalist design system (GeistMono, universalSans, zero shadows, zero radii, opacity-based hierarchy) while keeping all 8 HTML pages structurally identical and all route links intact.
