# Reflet — Frontend

Next.js 16 frontend for the Reflet reading app. Lets users discover books via the OpenLibrary API, upload their own EPUB files, and read them with an AI-powered chat sidebar.

## Getting started

```bash
cp .env.local.example .env
# fill in your values, then:
npm install
npm run dev
```

The dev server runs at `http://localhost:3000`.

## Environment variables

| Variable | Description |
|---|---|
| `GG_API_KEY` | Google Books API key (server-side routes) |
| `GG_API_URL` | Google Books base URL |
| `OPENLIB_API_URL` | OpenLibrary search base URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `NEXT_PUBLIC_BE_API` | Backend API base URL (e.g. `http://localhost:4000`) |

## Folder structure

```
reflet/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Route group — no shared navbar
│   │   ├── layout.tsx          # Auth-only layout
│   │   ├── login/page.tsx      # Sign-in page
│   │   └── register/page.tsx   # Sign-up page
│   │
│   ├── books/
│   │   ├── [workid]/           # Dynamic route — book detail by OpenLibrary work ID
│   │   │   ├── page.tsx        # Book detail page (server component)
│   │   │   ├── editions/
│   │   │   │   └── page.tsx    # All editions for a work
│   │   │   └── components/
│   │   │       ├── AuthorSection.tsx       # Author bio block
│   │   │       ├── BackButton.tsx          # Client-side back navigation
│   │   │       ├── BookDetailsSection.tsx  # ISBN, pages, publish date, etc.
│   │   │       ├── BookSidebar.tsx         # Cover image + action buttons sidebar
│   │   │       ├── DescriptionSection.tsx  # Collapsible description
│   │   │       ├── EpubUploadModal.tsx     # Drag-and-drop EPUB upload modal
│   │   │       └── ReadBookButton.tsx      # "Read this book" — checks upload, redirects or opens modal
│   │   │
│   │   ├── detail/page.tsx     # Legacy client-side detail page (query-param based)
│   │   ├── editions/page.tsx   # Legacy editions list (query-param based)
│   │   ├── read/               # EPUB reader
│   │   │   ├── page.tsx        # Reader page — fetches EPUB from API by workId
│   │   │   ├── hooks/
│   │   │   │   └── useEpubReader.ts        # Core epub.js hook (init, nav, highlight, progress)
│   │   │   ├── services/
│   │   │   │   ├── epubService.ts          # epub.js wrappers (init, TOC, locations, theme)
│   │   │   │   ├── highlightService.ts     # Highlight merge / add / remove logic
│   │   │   │   └── readingContextService.ts # Reading session helpers
│   │   │   ├── utils/
│   │   │   │   └── messageUtils.ts         # AI chat message formatting
│   │   │   └── components/
│   │   │       ├── AiChatPanel.tsx         # Right-panel AI chat (socket.io)
│   │   │       ├── HighlightMenu.tsx       # Floating menu on text selection
│   │   │       ├── NavigationButtons.tsx   # Prev / Next page buttons
│   │   │       ├── ReaderHeader.tsx        # Title, progress bar, finish button
│   │   │       └── TOCPanel.tsx            # Slide-out table of contents
│   │   │
│   │   ├── services/
│   │   │   └── bookService.ts  # OpenLibrary API helpers (fetchWork, fetchEditions, etc.)
│   │   ├── types/
│   │   │   └── bookTypes.ts    # Shared book-related TypeScript types
│   │   └── upload/page.tsx     # Standalone EPUB upload + in-browser preview page
│   │
│   ├── dashboard/page.tsx      # User dashboard (placeholder)
│   ├── home/page.tsx           # Landing / home page
│   ├── search/                 # Book search
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── BookCard.tsx
│   │       ├── BookGrid.tsx
│   │       ├── BookGridSkeleton.tsx
│   │       ├── QuickActions.tsx
│   │       └── SortSelector.tsx
│   │
│   ├── components/             # App-wide layout components
│   │   ├── ConditionalNavbar.tsx   # Hides navbar on auth routes
│   │   ├── Navbar.tsx
│   │   ├── NavItems.tsx
│   │   └── SearchBar.tsx
│   │
│   ├── globals.css             # Tailwind base styles + CSS variables
│   ├── layout.tsx              # Root layout (fonts, providers, navbar)
│   ├── page.tsx                # Root redirect
│   └── providers.tsx           # Client providers (React Query, Google OAuth, Toaster)
│
├── components/
│   └── ui/                     # shadcn/ui primitives (Button, Card, Dialog, Sheet, …)
│
├── contexts/                   # React contexts (empty, reserved for future use)
│
├── hooks/
│   ├── useChatSocket.ts        # socket.io client hook for AI chat
│   └── use-mobile.ts           # Viewport breakpoint hook
│
├── lib/
│   └── utils.ts                # cn() helper + shared utilities
│
├── store/
│   └── auth-store.ts           # Zustand store — accessToken + refresh logic
│
├── public/                     # Static assets served at /
│   └── pom.epub                # Sample EPUB for local testing
│
├── documents/                  # Project documentation (not shipped)
│   ├── db.md / db.sql          # Database schema notes
│   └── design/                 # Design docs and wireframes
│
├── .env.local.example          # Environment variable template
├── next.config.ts              # Next.js config (image domains, etc.)
├── tailwind.config / postcss   # Tailwind v4 setup
└── tsconfig.json
```

## Key flows

### Book discovery → reading
1. User searches on `/search` → clicks a book → lands on `/books/[workid]`
2. The **"Read this book"** button (`ReadBookButton`) checks via `GET /api/v1/books/:workId/check` whether the user has already uploaded an EPUB for that work
3. **No EPUB** → `EpubUploadModal` opens; user drops a `.epub` file → uploaded to the backend → redirected to reader
4. **Has EPUB** → redirected straight to `/books/read?workId=...`
5. The reader page fetches the EPUB blob from `GET /api/v1/books/:workId/epub` (authenticated), creates a blob URL, and passes it to `useEpubReader`

### Authentication
- JWT access token stored in Zustand (`auth-store.ts`) — in-memory only, lost on refresh
- Refresh token stored in an `HttpOnly` cookie (managed by the backend)
- `refreshAccessToken()` is called silently before any protected request that returns 401/403
