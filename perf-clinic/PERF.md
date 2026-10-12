### 1. Optimize search and result rendering

- **Symptom:** Searching tool calls takes around 278 ms per render, making search updates slower than necessary.
- **How I found it:** Used Chrome DevTools Console to measure `renderResults("billing")` across three runs before and after the changes.
- **Root cause:** Every search serialized and lowercased all 100,000 activity events, sorted the matching results again, and repeatedly wrote the viewed IDs to `localStorage` inside a loop.
- **Fix:** Precomputed searchable text and timestamps once, sorted the activity index once instead of on every search, and moved the `localStorage` write outside the loop.
- **Before / after:** Average render time decreased from **277.64 ms to 194.99 ms** across three runs each — approximately **29.8% faster**, saving **82.64 ms per render**.

### 2. Live ticker continues running after closing

- **Symptom:** The live ticker continues performing background work after its panel is closed.
- **How I found it:** Inspected the ticker lifecycle in `js/app.js` and used Chrome DevTools Performance recordings and console to analyze its behavior while opening and closing the ticker multiple times by adding `window.__tickerTicks = (window.__tickerTicks || 0) + 1;` as the first line inside the interval.
- **Root cause:** `openTicker()` created a recurring `setInterval()` timer every time the ticker opened, but `closeTicker()` removed only the panel without clearing the timer. The resize and keyboard event listeners also accumulated across openings.
- **Fix:** Stored the interval ID, cleared it when closing the ticker, and removed the associated event listeners during cleanup.
- **Before / after:** Across three runs, callback counts decreased from **81, 153, and 217** before the fix to **14, 14, and 14** after the fix. The average decreased from **150.33 to 14 callbacks**, a reduction of approximately **90.7%**.

### 3. Optimize the hero image

- **Symptom:** The hero image takes 173 ms to load and adds over 4 MB to the page's image payload.
- **How I found it:** Inspected the image dimensions and measured its transfer size and load time using Chrome DevTools Network. The original PNG was 1700 × 950 pixels and displayed at 1024 × 572 pixels.
- **Root cause:** The hero image used a large PNG file even though a more efficient image format could preserve its displayed dimensions with a much smaller file size.
- **Fix:** Converted `assets/hero.png` to WebP at quality 80, producing `assets/hero.webp`, and updated the HTML to use the optimized image.
- **Before / after:** File size decreased from **4,271 KB to 410 KB** (90.4% reduction). Observed load time decreased from **173 ms to 6 ms** (96.5% lower).

