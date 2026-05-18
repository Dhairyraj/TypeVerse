# TypeVerse — Project Master Plan
> Typing practice platform with AI-generated interest-based content, 10-finger technique training, and typing games.
> Built with: Next.js 15, Tailwind CSS v4, Framer Motion, Supabase, OpenRouter API (free tier), Vercel

---

## ⚠️ AGENT INSTRUCTIONS — READ FIRST

- Complete **one phase at a time**. Do NOT jump ahead.
- After finishing each phase, stop and wait for review.
- Never delete or overwrite files from a previous phase unless explicitly told to.
- All environment variables go in `.env.local` — never hardcode secrets.
- After every phase, update `update.md` with what was built.
- AI calls use OpenRouter (NOT Anthropic directly). Client lives in `lib/openrouter.ts`
- Default model: `meta-llama/llama-3.3-70b-instruct:free` via OpenRouter free tier
- Stack decisions are final unless the user says otherwise.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Auth + DB | Supabase |
| AI Content | OpenRouter API — `meta-llama/llama-3.3-70b-instruct:free` |
| Hosting | Vercel |
| Language | TypeScript |

---

## Project Structure (target)

```
typeverse/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── practice/
│   │   ├── page.tsx              # Interest selector
│   │   └── [interest]/page.tsx   # Typing session
│   ├── games/
│   │   ├── page.tsx              # Game lobby
│   │   └── zombie/page.tsx       # Zombie mode game
│   ├── leaderboard/page.tsx
│   ├── profile/page.tsx
│   └── layout.tsx
├── components/
│   ├── TypingEngine/
│   ├── KeyboardVisualizer/
│   ├── StatsDisplay/
│   ├── InterestSelector/
│   └── games/
├── lib/
│   ├── openrouter.ts             # OpenRouter client (replaces anthropic.ts)
│   ├── supabase.ts
│   └── utils.ts
├── hooks/
│   ├── useTypingEngine.ts
│   └── useWPM.ts
└── public/
```

---

## PHASE 1 — Project Foundation
**Goal: Working Next.js project with routing, styling, and basic UI shell**

### Tasks
1. Initialize Next.js 14 project with TypeScript and App Router
   ```bash
   npx create-next-app@latest typeverse --typescript --tailwind --app --src-dir=false
   ```
2. Install dependencies:
   ```bash
   npm install framer-motion @supabase/supabase-js @anthropic-ai/sdk lucide-react clsx
   ```
3. Set up Tailwind config with custom theme (dark, cinematic palette — see colors below)
4. Create global layout in `app/layout.tsx` with fonts (use `Geist Mono` for typing area, `Geist Sans` for UI)
5. Create a placeholder for every route listed in the project structure above (just return a `<div>` with the page name)
6. Create `.env.local` with these empty keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   OPENROUTER_API_KEY=
   ```
7. Set up `lib/supabase.ts` and `lib/openrouter.ts` with initialized clients (no actual calls yet)

`lib/openrouter.ts` template:
```ts
export async function generateWithAI(prompt: string): Promise<string> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content;
}
```
8. Create a Navbar component with: Logo (TypeVerse), nav links (Practice, Games, Leaderboard), and a placeholder auth button

### Color Palette (add to tailwind.config.ts)
```js
colors: {
  background: '#0a0a0f',
  surface: '#12121a',
  border: '#1e1e2e',
  accent: '#6c63ff',
  accentHover: '#857dff',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  textPrimary: '#e2e8f0',
  textMuted: '#64748b',
}
```

### Completion Criteria
- `npm run dev` runs without errors
- All routes load without crashing
- Navbar renders on all pages
- Dark background visible

---

## PHASE 2 — Core Typing Engine
**Goal: A fully working typing practice engine — the heart of the app**

### Tasks
1. Create `hooks/useTypingEngine.ts` with:
   - `input` state (what user has typed so far)
   - `currentIndex` tracking which character we're on
   - `errors` array tracking mistake positions
   - `isComplete` boolean
   - `handleKeyPress(key: string)` function
   - `reset()` function

2. Create `hooks/useWPM.ts` with:
   - `startTime` tracked on first keypress
   - `wpm` calculated as `(characters typed / 5) / minutes elapsed`
   - `accuracy` as `((total - errors) / total) * 100`
   - `elapsed` time in seconds

3. Create `components/TypingEngine/TypingDisplay.tsx`:
   - Renders the target paragraph character by character
   - Each `<span>` is one character
   - States: `untyped` (muted), `correct` (white), `incorrect` (red background), `cursor` (blinking bar before next char)
   - Smooth cursor blink animation with Framer Motion

4. Create `components/TypingEngine/TypingInput.tsx`:
   - A hidden `<input>` that captures all keypresses
   - Auto-focuses when component mounts
   - On mobile: shows a tappable area that brings up keyboard

5. Create `components/StatsDisplay/LiveStats.tsx`:
   - Shows: WPM (live), Accuracy %, Time elapsed, Errors count
   - Animate number changes with Framer Motion `AnimatePresence`

6. Wire everything together in a test page at `app/test/page.tsx` using a hardcoded paragraph

7. Add keyboard shortcut: `Tab + Enter` to restart, `Escape` to reset

### Rules for the Typing Engine
- Backspace IS allowed (corrects errors)
- Tab and Enter are ignored during typing
- Extra characters beyond paragraph length are ignored
- Errors are tracked per position, not total count

### Completion Criteria
- User can type a hardcoded paragraph
- Correct chars go green/white, errors go red
- WPM and accuracy update in real time
- Tab+Enter resets the test

---

## PHASE 3 — Interest Selector + AI Content
**Goal: Users pick an interest, AI generates a fresh paragraph every session**

### Interests to support (Phase 3):
```
marvel | anime | gaming | coding | science | history | sports | mythology
```

### Tasks
1. Create `app/api/generate-paragraph/route.ts` (Next.js API route):
   - Accepts `POST` with `{ interest: string, difficulty: 'easy' | 'medium' | 'hard', mode: 'letters' | 'words' | 'paragraph' }`
   - Calls OpenRouter via `generateWithAI()` from `lib/openrouter.ts`
   - Returns `{ paragraph: string }`
   - Add error handling and rate limiting placeholder

2. OpenRouter prompt templates by mode:

   **Letters mode:**
   ```
   Generate a typing practice sequence for beginners learning [INTEREST]-themed content.
   Return ONLY 30-40 characters using simple letters and spaces. No punctuation. No numbers.
   Focus on home row keys: a s d f g h j k l
   Example output: fall adds flask glad halls
   Return ONLY the sequence, nothing else.
   ```

   **Words mode:**
   ```
   Generate a list of 15-20 [INTEREST]-related words for typing practice.
   Difficulty [easy: 3-5 letter words | medium: 5-8 letter words | hard: 8+ letter words].
   Separate words with a single space. No punctuation. No numbers.
   Return ONLY the word list, nothing else.
   ```

   **Paragraph mode:**
   ```
   Generate a typing practice paragraph about [INTEREST].
   Rules:
   - Difficulty [easy: 150 chars | medium: 250 chars | hard: 400 chars]
   - Use real facts, character names, events related to [INTEREST]
   - No quotes, no dialogue, no markdown
   - Varied sentence structure for good typing rhythm
   - Avoid uncommon punctuation (em dashes, semicolons)
   - Return ONLY the paragraph, nothing else
   ```

3. Create `components/InterestSelector/ModePicker.tsx`:
   - Three mode buttons shown BEFORE difficulty:
     - 🔤 **Letters** — home row keys only, beginner
     - 📝 **Words** — themed word lists, intermediate
     - 📄 **Paragraph** — full sentences, advanced
   - Each mode has a short description subtitle
   - Selected mode gates which difficulty options appear:
     - Letters: no difficulty picker (always beginner)
     - Words: Easy / Medium / Hard
     - Paragraph: Easy / Medium / Hard

4. Create `components/InterestSelector/InterestGrid.tsx`:
   - Grid of interest cards (icon + label)
   - Each card has a hover animation (Framer Motion scale + glow)
   - Selected card gets accent border + filled background
   - Icons: use Lucide React or emoji for now

5. Create `components/InterestSelector/DifficultyPicker.tsx`:
   - Three buttons: Easy / Medium / Hard
   - Color coded: green / yellow / red

6. Wire up `app/practice/page.tsx`:
   - Shows ModePicker → InterestGrid → DifficultyPicker (in that order)
   - "Start Typing" button fetches AI content then navigates to `/practice/[interest]`
   - Pass `mode` and `difficulty` as sessionStorage alongside paragraph
   - Show skeleton loader while AI generates (pulsing lines, not spinner)
   - On error: friendly message + "Try Again" button

7. Wire up `app/practice/[interest]/page.tsx`:
   - Read paragraph + mode + difficulty from sessionStorage
   - If sessionStorage empty: auto re-fetch from API (handles refresh/direct link)
   - Renders full TypingEngine with AI content
   - Show current mode as a badge (e.g. "📄 Paragraph · Hard · Marvel")
   - "New Paragraph" button fetches fresh content and updates sessionStorage

### Completion Criteria
- User can select mode (Letters / Words / Paragraph), interest, and difficulty
- AI generates unique content for each combination
- Typing session loads with correct content for selected mode
- Mode badge visible during typing session
- New Paragraph button works
- Refresh on practice page re-fetches gracefully

---

## PHASE 4 — Keyboard Visualizer (10-Finger Guide)
**Goal: Animated keyboard that shows which finger to use for each key**

### Tasks
1. Create `components/KeyboardVisualizer/Keyboard.tsx`:
   - SVG or div-based keyboard layout (QWERTY)
   - All 26 letters + common punctuation keys rendered
   - Keys colored by finger assignment (8 colors, one per finger):
     ```
     Left pinky:   Q, A, Z + Tab, Caps, Shift
     Left ring:    W, S, X
     Left middle:  E, D, C
     Left index:   R, F, V, T, G, B
     Right index:  Y, H, N, U, J, M
     Right middle: I, K
     Right ring:   O, L
     Right pinky:  P, semicolon, slash + Enter, Shift
     Thumbs:       Spacebar
     ```
   - Two hand SVGs below keyboard showing which fingers are "active"

2. Create `components/KeyboardVisualizer/FingerHint.tsx`:
   - When the cursor rests on a character, highlight the correct key on the keyboard
   - Animate the correct finger on the hand SVG
   - Show finger name label: "Use your LEFT INDEX finger"

3. Add a toggle button on the practice page: "Show Keyboard Guide" / "Hide"
   - Keyboard slides down with Framer Motion when toggled

4. Add a dedicated `/learn` page:
   - Full interactive keyboard guide
   - Shows home row position (ASDF JKL;)
   - Step-by-step finger placement tutorial in 5 sections
   - Section 1: Home Row | Section 2: Top Row | Section 3: Bottom Row | Section 4: Numbers | Section 5: Speed Tips

### Completion Criteria
- Keyboard renders with color-coded fingers
- Current character's key highlights as user types
- Hand diagram shows active finger
- /learn page exists and is readable

---

## PHASE 5 — Supabase Auth + User Profiles
**Goal: Users can sign up, log in, and their stats are saved**

### Supabase Tables to Create
```sql
-- Users (handled by Supabase Auth)

-- typing_sessions
CREATE TABLE typing_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  interest TEXT,
  difficulty TEXT,
  wpm INTEGER,
  accuracy FLOAT,
  duration_seconds INTEGER,
  error_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- user_stats
CREATE TABLE user_stats (
  user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
  best_wpm INTEGER DEFAULT 0,
  average_wpm FLOAT DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_time_minutes FLOAT DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  last_practiced DATE,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tasks
1. Set up Supabase project (user does this manually — agent generates the SQL above)
2. Create `lib/supabase.ts` with full typed client
3. Create auth API routes:
   - `app/api/auth/callback/route.ts` (OAuth callback handler)
4. Create auth components:
   - `components/Auth/LoginModal.tsx` — Email/password + Google OAuth button
   - `components/Auth/UserMenu.tsx` — Avatar dropdown with: Profile, Stats, Sign Out
5. After each typing session completes, save to `typing_sessions` table
6. Create `app/profile/page.tsx`:
   - Shows: Best WPM, Average WPM, Total Sessions, Favorite Interest, Current Streak
   - Line chart of WPM over last 10 sessions (use Recharts)
   - Heatmap of practice days (like GitHub contributions)

### Completion Criteria
- User can sign up and log in
- Sessions save to Supabase after completion
- Profile page shows real stats

---

## PHASE 6 — First Game: Zombie Mode 🧟
**Goal: A game where zombies approach and the user must type to survive**

### Game Design
- Zombies spawn at the top of the screen, each carrying a word
- User types the word to eliminate that zombie
- Zombies move downward — if they reach the bottom, player loses a life (3 lives total)
- Difficulty increases every 30 seconds (more zombies, faster movement)
- Game ends when all lives are lost
- Score based on: words typed correctly × speed multiplier

### Tasks
1. Create `app/games/zombie/page.tsx` with full game loop
2. Game state (in a custom hook `hooks/useZombieGame.ts`):
   ```ts
   interface Zombie {
     id: string
     word: string
     x: number       // horizontal position
     y: number       // vertical y (increases over time)
     speed: number
     isTargeted: boolean
   }
   ```
3. Word lists: fetch short words (4-8 chars) from Anthropic per interest, or use a local word bank JSON file
4. Game canvas: use CSS/Framer Motion (no canvas API — keep it DOM-based for simplicity)
5. Targeting: auto-target the zombie whose word starts with what user is typing
6. Visual effects:
   - Zombie "explodes" with particle burst on correct word (CSS only)
   - Screen flashes red on life lost
   - Speed lines in background as difficulty increases
7. Game over screen: shows WPM, words defeated, accuracy — with share button
8. Save game score to Supabase `typing_sessions` with `interest = 'zombie_game'`

### Completion Criteria
- Full game loop works (spawn → type → eliminate → game over)
- Difficulty increases over time
- Score saves to profile
- Game over screen shows stats

---

## PHASE 7 — Leaderboard + Social Features
**Goal: Global and interest-specific leaderboards, shareable score cards**

### Tasks
1. Create `app/leaderboard/page.tsx`:
   - Tabs: All Time | This Week | By Interest
   - Table: Rank, Username/Avatar, WPM, Accuracy, Interest
   - Highlight the current user's row
   - Paginate (25 per page)

2. Supabase query for leaderboard (use a DB view):
   ```sql
   CREATE VIEW leaderboard AS
   SELECT 
     u.email,
     s.best_wpm,
     s.average_wpm,
     s.total_sessions
   FROM user_stats s
   JOIN auth.users u ON u.id = s.user_id
   ORDER BY best_wpm DESC;
   ```

3. Create shareable score card generator:
   - After session, show "Share your score" button
   - Opens a modal with a styled score card (dark card, WPM large, interest tag, TypeVerse branding)
   - "Copy as Image" uses `html2canvas` npm package
   - Pre-filled tweet text: "I just typed X WPM on TypeVerse! Try to beat me 🔥 [link]"

4. Add interest-specific leaderboards at `/leaderboard/marvel`, `/leaderboard/anime` etc.

### Completion Criteria
- Leaderboard loads real data
- Score card generates and can be copied
- Interest leaderboards work

---

## PHASE 8 — SEO + Performance + Launch Prep
**Goal: Rank on Google, pass Core Web Vitals, and be ready to share publicly**

### Tasks
1. Add metadata to every page using Next.js `generateMetadata`:
   - Title: `"Marvel Typing Practice | TypeVerse"`
   - Description: `"Practice typing with Marvel-themed paragraphs. Track your WPM, improve accuracy, and compete on the leaderboard."`
   - OG image per interest

2. Create static SEO pages (server-rendered):
   - `/practice/marvel` — pre-rendered with static content intro
   - `/practice/coding` — same for each interest
   - These pages load instantly and are indexable

3. Add JSON-LD schema markup on practice pages:
   ```json
   { "@type": "WebApplication", "name": "TypeVerse", "applicationCategory": "EducationalApplication" }
   ```

4. Create `app/sitemap.ts` — auto-generates sitemap.xml

5. Create `app/robots.ts` — allows all crawlers

6. Performance:
   - All images use `next/image`
   - Fonts use `next/font`
   - API routes have proper caching headers
   - Run Lighthouse — target score 90+ on all metrics

7. Create a `/blog` section with 3 starter articles:
   - "How to Learn 10-Finger Typing in 30 Days"
   - "What Is WPM and How to Improve Yours"
   - "The Best Typing Games for Beginners"

8. Set up Vercel deployment:
   - Connect GitHub repo to Vercel
   - Add all `.env.local` vars to Vercel environment
   - Set up custom domain (user provides domain name)

### Completion Criteria
- Lighthouse score 90+ (performance, SEO, accessibility)
- Sitemap and robots.txt accessible
- All pages have proper meta tags
- Deployed to Vercel with custom domain

---

## PHASE 9 — Second Game + Polish (Post-Launch)
**Goal: Word Rain game + final visual polish**

### Word Rain Game Design
- Words fall from the top like rain
- User types them before they hit the bottom
- Miss 5 words = game over
- Speed and frequency increase over time
- Interest-themed: Marvel words, Anime character names, etc.

### Polish Items
- Add sound effects (correct key = soft tick, error = thud, finish = chime) using Web Audio API
- Add user settings: toggle sound, toggle keyboard guide, preferred font size, preferred interest
- Add a "Daily Challenge" — same paragraph for everyone that day, global leaderboard resets at midnight
- Add confetti explosion on personal best WPM using `canvas-confetti` npm package
- Add keyboard shortcut cheatsheet modal (press `?` to open)

---

## Future Ideas (Backlog — Do Not Build Yet)
- Multiplayer race mode (WebSockets via Supabase Realtime)
- Mobile app (React Native / Expo)
- Custom text upload (paste your own paragraph)
- Code typing mode (actual code snippets with syntax highlighting)
- Boss Battle game (long Marvel paragraph = defeat Thanos)
- AI difficulty adjustment (gets harder as you improve)
- Discord bot integration (type races in Discord)

---

## Environment Variables Reference
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # server-side only

# OpenRouter (free tier — get key at openrouter.ai)
OPENROUTER_API_KEY=your_openrouter_api_key

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```
