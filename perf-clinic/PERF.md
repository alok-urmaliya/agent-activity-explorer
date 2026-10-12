### 1. Optimize search and result rendering

- **Symptom:** Searching tool calls takes around 278 ms per render, making search updates slower than necessary.
- **How I found it:** Used Chrome DevTools Console to measure `renderResults("billing")` across three runs before and after the changes.
- **Root cause:** Every search serialized and lowercased all 100,000 activity events, sorted the matching results again, and repeatedly wrote the viewed IDs to `localStorage` inside a loop.
- **Fix:** Precomputed searchable text and timestamps once, sorted the activity index once instead of on every search, and moved the `localStorage` write outside the loop.
- **Before / after:** Average render time decreased from **277.64 ms to 194.99 ms** across three runs each — approximately **29.8% faster**, saving **82.64 ms per render**.