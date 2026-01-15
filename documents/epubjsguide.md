# 📘 epub.js – Complete Developer Mental Model & API Guide

> Goal: After this document, you should be able to **fully control reading, navigation, highlights, persistence, and AI integration** using epub.js — without guessing.

---

## 1️⃣ What epub.js *Actually* Is

**epub.js is a stateful EPUB engine**, not a UI framework and not React-specific.

It provides:
- EPUB parsing
- Chapter rendering via iframes
- Navigation + layout
- A **global event system (EventEmitter)**
- Stable text addressing via **CFI**

You control it by **listening to events and issuing commands**.

---

## 2️⃣ Core Architecture (Mental Model)

```
Book (data & structure)
 ├─ Spine        → chapter order
 ├─ Navigation   → TOC
 ├─ Locations    → maps text → CFI
 └─ Rendition    → renders + emits events (YOU LISTEN HERE)
```

📌 You mainly work with **Book** and **Rendition**.

---

## 3️⃣ Creating a Book

```js
import ePub from "epubjs";

const book = ePub(input, options);
```

### Supported Inputs
- URL string
- `File` object
- `ArrayBuffer`

```js
ePub("/book.epub")
ePub(file)
ePub(arrayBuffer)
```

### Book Lifecycle

```js
book.ready.then(() => {})
book.loaded.metadata.then(meta => {})
book.loaded.navigation.then(nav => {})
book.loaded.spine.then(spine => {})
```

### Metadata
```js
book.package.metadata.title
book.package.metadata.creator
```

---

## 4️⃣ Rendition (The Control Center)

```js
const rendition = book.renderTo("viewer", {
  width: "100%",
  height: "100%",
  flow: "paginated", // or "scrolled"
  spread: "none"
});
```

```js
rendition.display();
rendition.next();
rendition.prev();
rendition.display(cfiOrHref);
```

---

## 5️⃣ EventEmitter System (CRITICAL)

**epub.js uses the EventEmitter pattern everywhere.**

```js
rendition.on("event", callback);
rendition.off("event", callback);
```

### Why This Matters
- epub.js is async
- Rendering happens in iframes
- You react to *what happened*, not poll state

---

## 6️⃣ Core Rendition Events (Must Know)

### 📖 relocated — Reading Progress

```js
rendition.on("relocated", location => {
  location.start.cfi
  location.end.cfi
  location.start.percentage
});
```

Used for:
- Reading analytics
- Session tracking
- Resume reading

---

### 🧱 rendered — Chapter Ready

```js
rendition.on("rendered", section => {
  section.href
});
```

Used for:
- Chapter-specific logic
- Debugging

---

### 🖱️ selected — Text Selection (HIGHLIGHTS)

```js
rendition.on("selected", (cfiRange, contents) => {
  const text = contents.window.getSelection().toString();
});
```

Used for:
- Highlighting
- AI prompts
- Notes

---

### 🧭 click — User Interaction

```js
rendition.on("click", event => {});
```

---

## 7️⃣ Hooks (NOT React Hooks)

Hooks allow you to **intercept iframe lifecycle**.

---

### 7.1 `rendition.hooks.content`

Runs for **every chapter iframe**.

```js
rendition.hooks.content.register(contents => {
  contents.document.body.style.fontFamily = "serif";
});
```

Use cases:
- Inject CSS
- Inject JS
- Attach listeners inside iframe

---

### Inject CSS

```js
rendition.hooks.content.register(contents => {
  contents.addStylesheet("/theme.css");
});
```

---

## 8️⃣ CFI

### Canonical Fragment Identifier (CFI)

CFI is a **precise pointer to text**, not page numbers.

Example:
```
epubcfi(/6/14[xchapter]!/4/2/18)
```

CFI is:
- Stable across layouts
- Used for bookmarks, highlights, restore position

---

### CFI Types

| Type | Meaning |
|---|---|
| CFI | Single position |
| CFI Range | Text selection |

---

### Convert CFI → Text

```js
book.getRange(cfiRange).then(range => {
  const text = range.toString();
});
```

🔥 This is how you send content to AI.

---

## 9️⃣ Highlights & Annotations

### Add Highlight

```js
rendition.annotations.add(
  "highlight",
  cfiRange,
  {},
  null,
  "hl-yellow"
);
```

---

### Remove Highlight

```js
rendition.annotations.remove(cfiRange, "highlight");
```

---

### Click Highlight

```js
rendition.annotations.add(
  "highlight",
  cfiRange,
  {},
  () => console.log("clicked")
);
```

---

### Highlight Styling

```css
.hl-yellow {
  background: yellow;
}
```

---

## 🔟 Themes & Layout Control

### Register Theme

```js
rendition.themes.register("dark", {
  body: { background: "#000", color: "#fff" }
});
```

```js
rendition.themes.select("dark");
```

---

### Font Size

```js
rendition.themes.fontSize("120%");
```

---

### Flow Mode

```js
rendition.flow("scrolled");
```

---

## 1️⃣1️⃣ AI Integration Pipeline (CORE USE CASE)

### Selection → AI

```js
rendition.on("selected", async cfiRange => {
  const range = await book.getRange(cfiRange);
  const text = range.toString();

  sendToAI({ text, cfiRange });
});
```

---

### Example AI Prompt Template

```
User highlighted the following passage:

"""
{{TEXT}}
"""

Context:
- Book: {{TITLE}}
- Reading progress: {{PERCENTAGE}}
- Goal: Deep understanding

Provide:
1. Explanation
2. Reflective question
3. Actionable insight
```

---

## 1️⃣2️⃣ Session-Based Reflection Mapping

| Feature | epub.js API |
|---|---|
| Start session | rendition.display() |
| Track progress | relocated |
| Anchor reflection | CFI Range |
| Persist highlights | annotations + DB |
| Restore session | display(cfi) |
| AI feedback | getRange(cfi) |

---

## 1️⃣3️⃣ What to Master (Order Matters)

1. Rendition events
2. CFI mental model
3. hooks.content
4. Annotations
5. getRange → AI

---

## ✅ Final Truth

If you understand:
- **Rendition emits events**
- **CFI is your anchor**
- **Hooks modify iframes**

Then epub.js becomes fully controllable.

Nothing is magic anymore.

