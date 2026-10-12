# Agent Activity Explorer — Notes

## What I built

Built a React + TypeScript application using Vite to explore agent activity events from the provided API. It supports event search, agent and status filters, date-range filtering, infinite scrolling, URL-synced filter state, browser back/forward navigation, and a deep-linkable event detail panel.

The interface includes an events-over-time histogram, loading and error states, and light/dark themes. The layout is responsive down to tablet width, and keyboard users can navigate available event rows and open or close the detail panel.

## Optional features

- **Histogram:** Visualizes event activity over time to help identify patterns.
- **System theme:** Initializes the theme using the operating system's color-scheme preference.
- **Accessibility improvements:** Added accessible names to search and filter controls and status announcements for loading and error states.

## Tradeoffs and future improvements

I prioritized the core event exploration workflow and URL state handling. Given more time, I would improve automated test coverage, refine keyboard navigation within the custom dropdowns, and further validate accessibility and performance with large datasets.

## Known incomplete items

Live mode using Server-Sent Events (SSE) is not implemented. Additional stretch goals, including a hand-built virtualized list, are still incomplete. Reduced-motion behavior and contrast across themes are some things that need a bit more work.

## Use of AI tools

I used ChatGPT for discussing implementation options, debugging, and reviewing accessibility and performance improvements. I reviewed the suggestions and tested all the changes during development.
