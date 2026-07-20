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
| `/daos/[daoId]` | `daos-detail.html` | DAO data navigator with indexed proposal, creator, participation, and voter-power evidence |
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
- **DAO directory default ordering** — `/daos` now communicates the default as market cap descending first, with last proposal descending only as the secondary tie-breaker. Engineering should map the active default sort state to market cap, keep the last-proposal affordance as a dashed/tie-breaker cue rather than the primary active sort, and preserve the existing activity/source chips plus alternate order chips (`Live proposals`, `Unique voters`, `Total`, `A–Z`).
- **No HTML changes needed for the shell** — the same sidebar, topbar, and mobile tab bar markup renders xAI-dark through CSS alone.
- **Typography requires font loading** — GeistMono and universalSans must be loaded (CDN or self-hosted) in the Next.js layout for the monospace display aesthetic.
- **Button markup conventions change** — production `.button` and `.button.dark` classes now render GeistMono uppercase with 1.4px letter-spacing. Labels should be short and commanding.
- **Sample values** remain marked as sample/preview. Replace with API data during production implementation.
- **Component semantics** unchanged: `StatePill`, `MetricCard`, `DaoCard`, `ProposalCard`, `VoteDistribution`, `EmptyState`, `LoadingSkeleton`, `ErrorState`, `CaveatBox`, `PageIntro`.

## Final summary

The project is now fully xAI dark-themed. Compared with the prior light DeFiLlama-inspired run, this pass replaces `atlas.css` with a complete xAI brutalist design system (GeistMono, universalSans, zero shadows, zero radii, opacity-based hierarchy) while keeping all 8 HTML pages structurally identical and all route links intact.

## Governance Feed

- The canonical `governance-feed.html` models `/v1/governance-signals` as four separate fields: relative `signalTimeMs`, typed event label, `dao / item title`, and an independent state/actionability or outcome label. The activity filter maps to `signal_types`; counts are dynamic backend values, and zero-count types may be omitted.
- `LIVE NOW` derives current open votes and proposals ending within 24 hours from stored proposal windows. `VOTE OUTCOMES · 14D` maps lifecycle outcomes distinctly: `passed` → `PASSED`, `failed` → `DEFEATED`, `no_quorum` → `NO QUORUM`, and `unknown`/unavailable → `OUTCOME UNAVAILABLE` without inference.
- `MOST ACTIVE · 14D SIGNALS` counts collapsed governance subjects per DAO, while forum counts cover the full 14-day window. Prototype figures are sample data only; production should render backend aggregation without exposing staging-only labels in the public UI.
- Execution and treasury activity are intentionally omitted. The current serving signal model has no typed execution or treasury event with reliable timestamp and provenance; execution should remain absent until the backend emits that explicit contract.
- The public hierarchy is intentionally headerless: a compact one-line page identity leads into three 34–38px Priority Signal rows, a horizontally scrollable text-tab toolbar, and 42–46px feed rows. Repeated alignment communicates time, signal type, subject, and outcome without schema labels; the 300px summary rail aligns with the Priority Signals strip.

## DAO Detail Data Navigator (2026-07-20)

- `daos-detail.html` is the canonical DAO-detail contract. It replaces the former Situation Room / Proposal Timeline rail with a single reading flow and a responsive Data Index.
- The approved information order is: `01 Overview`, `02 Proposal Explorer`, `03 Proposal Activity`, `04 Proposal Creators`, `05 Participation by Proposal`, `06 Established Voters`, `07 Participation Frequency`, `08 Typical Voting Power`, and `09 Power Concentration`.
- Proposal Explorer searches and filters the complete indexed proposal archive, loads rows progressively, and opens the shared governance side panel without changing routes. Monthly activity, creator, proposal-participation, voter, and distribution rows also open evidence drilldowns.
- `backend-sample-uniswap.json` is a fixture and handoff contract, not production data. Production must derive the same semantics from backend serving APIs: proposal lifecycle/outcome, effective ballots, unique voters, creator coverage, latest-effective voter participation, average voting power per voted proposal, and cumulative observed cast-power concentration.
- Established Voters requires at least five joined proposals so one-off high-power addresses do not dominate the repeat-participant table. Observed cast voting power is governance participation evidence, not wallet holdings or delegated token balance.
- Power Concentration uses each address's total latest-effective voting power across indexed proposals. It must not be produced by summing proposal-aligned per-voter share percentages, because those rows can use different covered-proposal denominators.
- Quorum Performance is intentionally absent from the approved DAO-detail flow. When a backend evidence family is unavailable, production should omit that module and let the remaining cards close the layout naturally rather than inventing values.
- Desktop uses a sticky right-side Data Index; tablet uses the horizontal section rail; mobile uses the modal section selector. Scroll-spy must pin the final item when the page reaches its absolute bottom. All panel and navigator interactions must preserve Escape-to-close and trigger focus restoration.
