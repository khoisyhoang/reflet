# 📘 Book Reflection App — System Design (Rewritten + Reflection Integrated)

## 1. Book Discovery & Edition Preference

Users discover books through search or browsing.

When opening a book for the first time, the system displays a default edition (selected based on popularity or availability).

Users may view and switch to another edition. Once an edition is selected, it becomes the user's preferred edition, and future interactions with that book automatically use it.

Edition preference is user-specific and does not affect other users.

## 2. Ownership & EPUB Upload Logic

Books can exist in a user's library in two states: owned or not owned.

When a user clicks "Read Now", the system checks whether an EPUB file exists for that user and book.

If no file exists, the user is prompted to upload an EPUB.

Uploading an EPUB automatically marks the book as Owned if it was not already.

Users may also manually mark a book as Owned without uploading a file (e.g. physical or external copy).

Ownership is treated as metadata, not a gatekeeper. Users may still explore or reflect on books they do not own.

## 3. Book Hub (Book-Centric Dashboard)

After uploading an EPUB (or if one already exists), users are redirected to a Book Hub — a dedicated page centered around a single book.

The Book Hub displays:

- Book metadata (title, author, edition, cover)
- Ownership status
- Reading progress
- Total sessions completed
- Total time spent reading
- Highlight count
- Reflection count
- Session history
- Book-specific analytics

This page acts as the long-term memory and progress tracker for the book.

A prominent "Start Session" button allows the user to begin a new reading session at any time.

## 4. Reading Session Lifecycle

A Session represents a focused, time-bounded interaction with a book.

When a session starts:

The EPUB is loaded and rendered inside the app

The system records:

- Session start time
- Duration
- Reading location (page / section)
- Navigation behavior (e.g. skimming vs continuous reading)

During the session, users can:

- Highlight passages
- Add optional inline notes
- Ask AI contextual questions based strictly on their highlights

The reading experience is intentionally minimal to encourage focus and thought.

## 5. Highlight-Centered Interaction Model

Highlights act as anchors for thinking, not just saved quotes.

Each highlight stores:

- Text content
- Location (page / section)
- Timestamp
- Associated session

Highlights can later be:

- Reflected upon
- Grouped by theme
- Used as input for AI-powered reflection prompts

## 6. Reflection System (Core Value)

Reflection is the central feature of the app and is tightly coupled to both highlights and sessions.

Reflection does not require rereading the book; it operates entirely on the user's interactions and thoughts.

### 6.1 Reflection During a Session

After creating a highlight, users may choose to reflect immediately.

The system (optionally via AI) prompts the user with one focused question, such as:

- Why did this passage stand out to you?
- What assumption or belief does this challenge?
- How does this connect to something you already know?
- How could this idea apply to your life or work?

The user's response is stored as a Highlight Reflection, linked directly to that passage.

### 6.2 Reflection at the End of a Session

At the end of a session, users are guided into a Session Reflection phase.

Instead of many questions, the system asks one high-impact question, for example:

- What is the single most important idea from this session?
- Did anything shift in how you think about this topic?
- What surprised you while reading today?

This reflection captures the user's meta-thinking, not book content.

### 6.3 Reflection Modes (Intentional Thinking)

Before reflecting, users may optionally choose a Reflection Mode, which determines the type of prompt shown:

- Understand — restate the idea in their own words
- Question — express confusion, doubt, or disagreement
- Connect — link the idea to another book or personal experience
- Apply — describe a possible behavior or mindset change

Reflection modes shape thinking without overwhelming the user.

### 6.4 AI as a Reflection Mirror (Not a Teacher)

AI in the system does not explain book content.

Instead, it analyzes:

- User highlights
- User-written reflections
- Session behavior (time spent, frequency of highlights)

Based on this data, AI may:

- Identify recurring themes in the user's thinking
- Point out patterns (e.g. focus on discipline, systems, or uncertainty)
- Ask one follow-up question that encourages deeper reflection

AI output is stored as part of the session history.

### 6.5 Delayed Reflection (Thinking Over Time)

The system may prompt users to revisit past reflections after a delay (e.g. 1 day or 7 days).

Example:

"You wrote this after your last session. Do you still agree? Why or why not?"

This allows the app to track how the user's thinking evolves, not just what they read.

## 7. Analytics & Long-Term Insight

Over time, the system builds a personal reflection dataset for each user.

Book-level and user-level analytics may include:

- Average session length
- Reflection frequency
- Common reflection themes
- Ideas revisited or revised over time

These insights are derived from user behavior and reflections, not book text.