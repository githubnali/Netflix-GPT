# Netflix GPT — Architecture & Learning Guide

A Netflix-clone SPA with a GPT-powered movie search feature, built with React + Vite. This document explains how the project is structured, how the files connect to each other, and what topics it demonstrates. (The original `README.md` is a chronological changelog of how the project was built; this document instead maps the *current* codebase.)

## 1. Tech Stack

| Concern | Choice |
|---|---|
| Build tool | Vite 8 (Rolldown bundler) — `vite.config.js`, output dir `build/` |
| UI library | React 19 |
| Routing | React Router DOM v7 (`createBrowserRouter`), route-level code splitting via `React.lazy` + `Suspense` |
| State management | Redux Toolkit + react-redux v9 |
| Auth | Firebase Auth v12, with a `ProtectedRoute` guard on `/browse` |
| Movie data | TMDB REST API (raw `fetch`) |
| AI recommendations | OpenAI SDK v7 (client-side, lazy-loaded with the GPT search feature) |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite` plugin, no separate config file) |
| Icons | react-icons |
| Testing | none configured |

## 2. Directory Structure

Components are grouped by feature/ownership rather than left flat:

```
netflix+gpt/
├── index.html                  # Vite HTML entry; SEO meta tags (description, OG, Twitter card)
├── vite.config.js              # Vite + React + Tailwind plugins; manualChunks vendor splitting
├── firebase.json / .firebaserc # Firebase Hosting config (serves the "build" folder)
├── .env                        # VITE_TMDB_KEY, VITE_OPENAI_KEY (gitignored)
├── public/                     # favicon.svg (N+G mark), header logo, icons
└── src/
    ├── main.jsx                 # ReactDOM root, renders <App/>
    ├── App.jsx                  # Wraps app in Redux <Provider>
    ├── index.css                 # Tailwind import, global resets, shimmer keyframes
    ├── components/
    │   ├── Body.jsx              # Router shell: auth listener, route table, Suspense boundaries
    │   ├── common/                Header.jsx, ProtectedRoute.jsx (shared across pages)
    │   ├── Login/                 Login.jsx
    │   ├── Browse/                Browse.jsx, MainContainer.jsx, SecondaryContainer.jsx,
    │   │                          VideoBackground.jsx, VideoTitle.jsx
    │   ├── movies/                MovieList.jsx, MovieCard.jsx (shared by Browse and GptSearch)
    │   ├── GptSearch/              GptSearch.jsx, GptSearchBar.jsx, GptMovieSuggestions.jsx
    │   └── shimmer/                ShimmerCard, ShimmerMovieList, ShimmerMainContainer, ShimmerGptResults
    ├── hooks/                    # Custom hooks (data-fetching layer)
    └── utils/                    # Redux slices, store, constants, firebase/openAI clients
```

## 3. How Requests Flow: Entry to Screen

```
index.html
   └─ main.jsx        (ReactDOM.createRoot)
        └─ App.jsx     (<Provider store={appStore}>)
             └─ Body.jsx   (auth listener + Router: "/" and "/browse")
                  ├─ "/"       → <Suspense> → Login.jsx
                  └─ "/browse" → <ProtectedRoute> → <Suspense> → Browse.jsx
                                                                    └─ "/browse" (GPT view) → <Suspense> → GptSearch.jsx
```

`App.jsx` is the single place the Redux store is injected into the component tree. `Body.jsx` is the *only* file that defines routes and the *only* place `onAuthStateChanged` is subscribed — it owns auth state for the whole app, gating first render behind an `authChecked` flag so routes never render before Firebase has resolved the session. `Login`, `Browse`, and `GptSearch` are all `React.lazy`-loaded, each wrapped in its own `<Suspense>` with a shared `PageLoader`/shimmer fallback, so a user only downloads the code for the page (and, for GPT search, the `openai` SDK) they actually visit.

`ProtectedRoute.jsx` (`components/common/`) reads `store.user` and redirects to `/` if there's no session — this is the only route guard in the app; `Login.jsx` mirrors it in reverse with a `useEffect` that redirects an already-authenticated user from `/` to `/browse`. Redirects are entirely reactive to Redux state now — no component calls `navigate()` as a side effect of a Firebase promise resolving, which previously caused a race condition (see §10).

## 4. Component Map & Connections

### Login flow (`components/Login/Login.jsx`)

Toggles between Sign In / Sign Up forms. Uses `useRef` for uncontrolled email/password/name inputs (no `useState` for form fields). Before calling Firebase, it validates input via `checkValidData()` from `utils/validate.js`. On sign-up it calls Firebase's `createUserWithEmailAndPassword` + `updateProfile` (setting a `DEFAULT_USER_AVATAR` from `utils/constants.js`) and dispatches `addUser` itself; on sign-in it just calls `signInWithEmailAndPassword` and lets `Body.jsx`'s auth listener populate the store. Either way, a `useEffect` watching `store.user` handles the actual navigation to `/browse`. Sets the document title via `useDocumentTitle` ("Sign In" / "Sign Up"). Renders `<Header/>` above the form.

### Header (`components/common/Header.jsx`, shared across both pages)

Purely presentational + dispatch-only now — it no longer owns any auth subscription (that moved to `Body.jsx`). It reads `store.user` to decide whether to show the logged-in nav (language `<select>`, GPT search toggle, avatar, sign out), dispatches `toggleGptSearchView` and `changeLanguage`, and calls `signOut(auth)` on sign-out — the resulting redirect to `/` happens declaratively once `ProtectedRoute` sees `store.user` go null, not via an imperative `navigate()` call. The GPT search button and language dropdown are styled to match the rest of the app's red/black theme (previously an unrelated purple button and light-gray dropdown).

### Browse page (`components/Browse/`)

- **`Browse.jsx`** — calls all four movie-fetching hooks (`useNowPlayingMovies`, `usePopularMovies`, `useTopratedMovies`, `useUpcomingMovies`) on mount, sets the document title, then reads `store.gpt.showGptSearch` to decide whether to show the normal browse UI or the (lazy-loaded) GPT search UI:
  - `false` → renders `MainContainer` + `SecondaryContainer`
  - `true` → renders `<Suspense><GptSearch/></Suspense>`, with `ShimmerGptResults` as the fallback while the GPT search chunk downloads

- **`MainContainer.jsx`** — takes the first "now playing" movie from Redux and renders `VideoTitle` (title/overview, presentational) and `VideoBackground` (trailer). Renders `ShimmerMainContainer` instead of `null` while `nowPlayingMovies` hasn't loaded yet.
- **`VideoBackground.jsx`** — calls `useMovieTrailer(movieId)`, which fetches the trailer and stores it in Redux; embeds it as a YouTube iframe and toggles mute via `postMessage`.
- **`SecondaryContainer.jsx`** — reads the full `movies` slice and renders one row per category (Now Playing / Popular / Top Rated / Upcoming), swapping in a `ShimmerMovieList` for any row still `null` (not yet fetched) instead of blocking all four rows on the slowest request.
- **`MovieList.jsx`** (`components/movies/`) — a reusable horizontally-scrollable row of `MovieCard`s. It's used both by `SecondaryContainer.jsx` (TMDB category rows) *and* `GptMovieSuggestions.jsx` (GPT-recommended rows) — the single biggest reuse point in the codebase, which is why it lives in its own `movies/` folder rather than under `Browse/`.
- **`MovieCard.jsx`** (`components/movies/`) — pure presentational poster card; builds its image URL from `IMG_CDN_URL` (`utils/constants.js`) + the poster path. Images use `loading="lazy" decoding="async"` so offscreen carousel posters don't compete with initial paint.

### GPT Search flow (`components/GptSearch/`, lazy-loaded as a unit)

- **`GptSearch.jsx`** — container shown when `showGptSearch` is true; renders `GptSearchBar` + `GptMovieSuggestions`.
- **`GptSearchBar.jsx`** — the core AI integration. On submit it:
  1. Dispatches `setGptSearchLoading(true)`.
  2. Builds a prompt asking for 5 comma-separated movie names matching the user's query.
  3. Calls `openAi.chat.completions.create(...)` (client from `utils/openAi.js`) inside a `try/catch`.
  4. Splits the response into movie names, then calls TMDB's `/search/movie` for each name **in parallel** via `Promise.all`.
  5. Dispatches `addGptMovieResult({ movieNames, movieResults })` on success, or `setGptSearchError(...)` on failure/empty response — a failed call now surfaces a visible message instead of failing silently.
  Also submits on Enter, disables the input/button while loading, and reads `store.config.lang` for localized placeholder/button text from `utils/languageConstants.js`.
- **`GptMovieSuggestions.jsx`** — reads `store.gpt.{movieNames, movieResults, isLoading, errorMessage}` and renders, in priority order: a `ShimmerGptResults` skeleton while loading, an error message if the search failed, one `MovieList` per suggested movie on success, or nothing before a search has been run.

## 5. State Management (Redux Toolkit)

```
utils/appStore.js
 ├─ user   → utils/useSlice.js       (misleadingly named — this is the USER slice)
 ├─ movies → utils/moviesSlice.js
 ├─ gpt    → utils/gptSlice.js
 └─ config → utils/configSlice.js
```

- **`user` slice** (`utils/useSlice.js`) — `addUser` / `removeUser`. Dispatched exclusively by `Body.jsx`'s auth listener (plus `Login.jsx` on sign-up, to avoid waiting a round trip). Read by `ProtectedRoute.jsx`, `Login.jsx`, and `Header.jsx`.
- **`movies` slice** (`utils/moviesSlice.js`) — holds `nowPlayingMovies`, `popularMovies`, `topratedMovies`, `upcomingMovies`, `trailerVideo`, each `null` until its hook populates it (the `null`-vs-array distinction is what drives shimmer-vs-content rendering in `SecondaryContainer.jsx`/`MainContainer.jsx`). Populated exclusively by the 5 hooks in `src/hooks/`.
- **`gpt` slice** (`utils/gptSlice.js`) — `showGptSearch`, `movieNames`, `movieResults`, `isLoading`, `errorMessage`. Toggling `showGptSearch` (via `toggleGptSearchView`) now also resets `movieNames`/`movieResults`/`isLoading`/`errorMessage` back to their defaults, so switching to Home Page and back to GPT Search doesn't show a stale result from the previous search. `resetGptSearch()` restores the entire slice to its initial state and is dispatched by `Body.jsx` on sign-out, so a new session doesn't inherit the previous user's search state.
- **`config` slice** (`utils/configSlice.js`) — current UI language (`lang`). Set by `Header.jsx`, read by `GptSearchBar.jsx`.

`appStore.js` is only ever imported in `App.jsx`, which wires it up via `<Provider>`.

## 6. Custom Hooks (`src/hooks/`)

Each movie-fetching hook follows the same recipe: fetch a TMDB endpoint with the shared `OPTIONS` auth header (from `utils/constants.js`), then dispatch the result into `moviesSlice`, guarded by a check to avoid refetching data already in the store (basic memoization).

| Hook | TMDB endpoint | Dispatches |
|---|---|---|
| `useNowPlayingMovies` | `/movie/now_playing` | `addNowPlayingMovies` |
| `usePopularMovies` | `/movie/popular` | `addPopularMovies` |
| `useTopratedMovies` | `/movie/top_rated` | `addTopratedMovies` |
| `useUpcomingMovies` | `/movie/upcoming` | `addUpcomingMovies` |
| `useMovieTrailer` | `/movie/{id}/videos` | `addTrailerVideo` |
| `useDocumentTitle` | — | sets `document.title` as a side effect (used by `Login.jsx`, `Browse.jsx`) |

> **Known bug (unchanged)**: `useTopratedMovies.js` checks `store.movies.topRatedMovies` (capital R) for its "already fetched" guard, but the slice's actual key is `topratedMovies` (lowercase r). The guard is effectively broken (it refetches every time), though display still works since rendering code uses the correct key.
>
> **Known gap**: none of the fetching hooks have error handling — a network failure or a bad/missing `VITE_TMDB_KEY` throws unhandled, and the affected row just stays on its shimmer skeleton forever with no user-facing feedback.

## 7. Utilities & Configuration (`src/utils/`)

- **`constants.js`** — single source of truth for hardcoded values: `BG_LOGO`, `DEFAULT_USER_AVATAR`, `IMG_CDN_URL`, `SUPPORTED_LANGUAGES`, TMDB `OPTIONS` header (reads `VITE_TMDB_KEY`), and `OPENAI_KEY` (reads `VITE_OPENAI_KEY`). Imported by nearly every component and hook that talks to an external API.
- **`languageConstants.js`** — a plain JS dictionary (en / hindi / spanish) for the GPT search bar's translated text. Consumed only by `GptSearchBar.jsx`.
- **`validate.js`** — `checkValidData(email, password)`, regex-based form validation. Consumed only by `Login.jsx`. (A full-name regex exists commented-out and unused — the Sign Up form's Full Name field currently has no validation.)
- **`firebase.js`** — initializes the Firebase app and exports the `auth` instance. Analytics is *not* initialized eagerly: `initAnalytics()` dynamically imports `firebase/analytics` and is called once from `Body.jsx` during browser idle time, keeping it off the critical rendering path.
- **`openAi.js`** — instantiates the OpenAI client with `dangerouslyAllowBrowser: true` (the API key is shipped to the browser — acceptable for a learning project, but not for production). Consumed only by `GptSearchBar.jsx`, and only ever downloaded when the GPT search feature is opened (it's inside the `GptSearch` lazy chunk).

## 8. Styling

Tailwind CSS v4, wired in purely through the `@tailwindcss/vite` plugin (`vite.config.js`) plus `@import "tailwindcss";` in `src/index.css` — there's no `tailwind.config.js`/`postcss.config.js` since v4 is CSS-first. All components use inline utility classes with responsive (`sm:`/`md:`/`lg:`) breakpoints; no CSS Modules or styled-components. `index.css` also defines a `.shimmer` class (CSS keyframe sweep animation) used by every component in `components/shimmer/`.

## 9. Performance

- **Code splitting**: `Login`, `Browse`, and `GptSearch` are separate `React.lazy` chunks. The `openai` package only downloads when a user opens GPT search, not on every page load.
- **Vendor chunking**: `vite.config.js` groups `react`/`react-dom`/`react-router-dom`, `react-redux`/`@reduxjs/toolkit`, and `firebase` into their own build chunks for better long-term browser caching, instead of one large bundle.
- **Deferred analytics**: `firebase/analytics` is dynamically imported during idle time (see §7) rather than blocking initial load.
- **Lazy images**: `MovieCard.jsx` posters use `loading="lazy"`.
- **Shimmer/skeleton loading states**: every async-data section (hero, movie rows, GPT results) shows a matching shimmer skeleton instead of a blank screen or `null` while its data is in flight (see `components/shimmer/`).

## 10. External Services

| Service | Used for | Where configured | Where called |
|---|---|---|---|
| Firebase Auth | email/password sign up, sign in, sign out, profile update, auth-state listener | `utils/firebase.js` | `Login.jsx`, `Header.jsx`, `Body.jsx` |
| Firebase Analytics | usage analytics (lazy-loaded) | `utils/firebase.js` (`initAnalytics`) | `Body.jsx` |
| Firebase Hosting | deployment target | `firebase.json`, `.firebaserc` | (CLI deploy, not code) |
| TMDB API | now playing / popular / top rated / upcoming movies, trailers, search | `utils/constants.js` (`OPTIONS`) | `src/hooks/*`, `GptSearchBar.jsx` |
| OpenAI API | turning a natural-language query into 5 movie names | `utils/openAi.js` | `GptSearchBar.jsx` |

## 11. Known Rough Edges (worth knowing before you extend the code)

- `utils/useSlice.js` is actually the **user** slice — its filename doesn't follow the `xSlice.js` convention used everywhere else.
- `useTopratedMovies.js` has a selector-key typo that breaks its refetch guard (see §6).
- None of the TMDB/trailer fetch hooks handle request failures — a failed fetch just leaves the shimmer spinning forever.
- `Header.jsx` calls `navigate("/error")` on sign-out failure, but no `/error` route exists in `Body.jsx`.
- The OpenAI key is embedded client-side (`dangerouslyAllowBrowser: true`) — fine for a personal/learning project, not for shipping to real users. A production version needs a backend proxy so the key never reaches the browser.
- The Sign Up form's Full Name input has no validation (the regex for it exists in `validate.js` but is commented out and unused).
- No automated tests exist yet.

## 12. Topics This Project Demonstrates

- React fundamentals: functional components, prop drilling, composition (`VideoTitle`, `MovieCard`, `MovieList` reuse)
- Hooks: `useState`, `useEffect` (with cleanup), `useRef` (uncontrolled inputs, DOM refs), and writing your own custom hooks (including a tiny one, `useDocumentTitle`)
- Redux Toolkit: `configureStore`, `createSlice`, multiple slices, `useSelector` / `useDispatch`, resetting slice state to its initial value
- React Router v7: `createBrowserRouter`, `RouterProvider`, declarative auth-based redirects (`ProtectedRoute` + `useEffect`-driven navigation) instead of imperative `navigate()` calls chained to async side effects
- Code-splitting a React app with `React.lazy` + `Suspense`, and manual vendor chunking in Vite/Rollup
- Firebase Authentication: sign up, sign in, sign out, `onAuthStateChanged`, `updateProfile`, centralizing the auth subscription in one place to avoid race conditions
- Manual form validation with regex (no form library)
- Consuming a third-party REST API with Bearer-token auth (TMDB)
- Embedding & controlling external media (YouTube iframe + `postMessage`)
- Integrating an LLM client-side (OpenAI chat completions), prompt design, chaining its output into a second API call, and handling/surfacing failures (loading + error states)
- Basic internationalization (i18n) via a plain object dictionary + Redux-stored language state
- Conditional UI rendering driven by global state
- Skeleton/shimmer loading UI as an alternative to spinners or blank states
- Environment variables in Vite (`import.meta.env.VITE_*`) and keeping secrets out of git
- Utility-first, responsive styling with Tailwind CSS v4
- Basic memoization/guard patterns to avoid redundant network calls
- Basic SEO for an SPA: meta description/OG/Twitter tags, dynamic per-route `document.title`
- Deploying a Vite build to Firebase Hosting
