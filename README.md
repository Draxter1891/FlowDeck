# FlowDeck: Kanban Task Board

A responsive Kanban board built for a 2.5-hour frontend machine-coding round. Tasks live in three columns (Todo, In Progress, Completed), can be dragged between them on desktop, and survive a page refresh.

---

## The brief

| Requirement | How it's met |
| --- | --- |
| Add a task (title, description, priority, due date) | `TaskModal` + `TaskForm`, opened from the header or a column's `+` |
| Edit and delete | Pencil and trash buttons on every card; delete asks for a second click |
| Move tasks between columns | Drag and drop on desktop, a Start / Done / Reopen button on mobile |
| Search by title | Toolbar search, case-insensitive |
| Filter by priority and status | Toolbar selects (status filter is desktop-only; phones use column tabs) |
| Persist in LocalStorage | Saved after every change, validated on load |
| Responsive | Three-column board on desktop, one column with tabs on phones |
| Empty, no-results and validation states | Per-column empty state, "No matching tasks", inline title validation |

---

## How I approached it

### 1. Read the brief, then cut scope
The design reference (Google Stitch) was bigger than the brief: task codes, a sort dropdown, header chips, an avatar. Every extra is something I have to build, maintain and explain inside 2.5 hours, so I kept **one** extra, the stats strip (total / in progress / overdue), because it is derived from data I already have. Everything else was left out on purpose.

### 2. Design tokens before components
The "Nocturnal Atelier" design file became a Tailwind v4 `@theme` block in `index.css`. Colors, fonts and shadows live in one place, so components use names like `bg-card` and `text-muted` instead of hex values. One token (`--color-base`) collided with Tailwind's built-in `text-base`, so it became `--color-canvas`.

### 3. Model the data and the state first
A task is a small flat object:

```js
{ id, title, description, priority, dueDate, status, createdAt }
```

All state lives in **one context** (`BoardContext.jsx`) with three parts:

- **Tasks:** `useReducer` with four actions (add, update, move, delete). Persisted to LocalStorage in an effect.
- **Filters:** search text, priority and status in `useState`.
- **Dialog:** whether the task dialog is closed, creating, or editing.

### 4. Derive, don't store
Tasks per column, sort order and the headline stats are **computed** from tasks and filters with `useMemo`. There is no second copy of the data to keep in sync. Columns sort by earliest due date, with undated tasks last.

### 5. One way to change a status
Dragging a card, tapping Start / Done on mobile, and changing Status in the edit form all end in the same `moveTask(id, status)`. There is one place where a task changes column, so there is one place to debug.

### 6. Build bottom-up
1. Foundation: Vite, Tailwind tokens, constants, date and storage utilities
2. State: `BoardContext`
3. UI primitives: `Button`, `Modal`, `Select`, badges, empty state
4. Page chrome: header, stats strip, toolbar
5. Task dialog: form and modal
6. Board: card, column, drag and drop, mobile tabs
7. `App.jsx` wires it together

### 7. Two layouts, one source of truth
Desktop and mobile are separate components (`DesktopBoard`, `MobileBoard`) chosen by a `useMediaQuery` hook at the 768px breakpoint. They read the same context and render the same `TaskCard`. Only the way a task moves differs.

---

## Tech stack and packages

| Package | Why |
| --- | --- |
| `react`, `react-dom` | UI |
| `vite`, `@vitejs/plugin-react` | Dev server and build |
| `tailwindcss`, `@tailwindcss/vite` | Styling (Tailwind v4, tokens in CSS, no config file) |
| `@dnd-kit/react` | Drag and drop on desktop (the current dnd-kit; the older `@dnd-kit/core` is labelled legacy) |
| `lucide-react` | Icons |

Fonts (Google Fonts): **Plus Jakarta Sans** for text, **Inter** for labels and numbers.

No state library, no form library, no UI kit. State is React's own `useReducer` + Context, and the dialog is the browser's native `<dialog>`.

---

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
```

Save the brand logo as `public/logo.png`.

---

## Folder structure

```
kanban-board/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── logo.png
└── src/
    ├── main.jsx                  # wraps <App /> in BoardProvider
    ├── App.jsx                   # page shell
    ├── index.css                 # Tailwind v4 + design tokens
    │
    ├── context/
    │   └── AppContext.jsx      # reducer, filters, dialog state, derived data, useBoard()
    │
    ├── constants/
    │   └── board.js              # statuses, priorities, next-action map
    │
    ├── utils/
    │   ├── date.js               # isOverdue, isDueToday, formatDue
    │   └── storage.js            # safe LocalStorage load / save
    │
    ├── hooks/
    │   └── useMediaQuery.js      # desktop vs mobile layout
    │
    └── components/
        ├── ui/                   # reusable, no board knowledge
        │   ├── Button.jsx
        │   ├── Modal.jsx
        │   ├── Select.jsx
        │   ├── PriorityBadge.jsx
        │   ├── CountBadge.jsx
        │   └── EmptyState.jsx
        ├── layout/
        │   └── Header.jsx
        ├── stats/
        │   └── StatsStrip.jsx
        ├── toolbar/
        │   └── Toolbar.jsx
        ├── board/
        │   ├── Board.jsx         # picks desktop or mobile
        │   ├── DesktopBoard.jsx  # drag-and-drop provider + overlay
        │   ├── MobileBoard.jsx   # one column at a time
        │   ├── ColumnTabs.jsx    # mobile tab bar
        │   ├── Column.jsx        # droppable desktop column
        │   ├── ColumnEmpty.jsx   # empty / no-results message
        │   ├── DraggableCard.jsx # drag behavior only
        │   └── TaskCard.jsx      # pure display, memoized
        └── task/
            ├── TaskModal.jsx     # create / edit dialog
            └── TaskForm.jsx      # fields + validation
```

---

## Decisions and trade-offs

- **Single context.** Simple to explain and enough for this size. The cost: any change re-renders every consumer. I keep actions stable and wrap `TaskCard` in `React.memo`, which only works because the card receives props and never calls `useBoard()` itself.
- **`useReducer` over scattered `useState`.** Every change to the task list goes through one reducer, so the possible transitions are listed in one place.
- **No in-column reordering.** The brief asks for moving between columns, not ordering within one. Columns sort by due date, so a dropped card lands in its sorted position. Manual ordering would need a stored order and sortable lists.
- **`@dnd-kit/react` defaults.** Its default sensors require a few pixels of movement (or a short hold on touch) before a drag starts, and ignore presses on buttons, so clicking edit or delete never grabs the card.
- **Mobile has no dragging.** Touch drag fights page scrolling. A button per card is more reliable and easier to use one-handed.
- **Native `<dialog>` and `<select>`.** The browser provides focus trapping, Esc to close and a proper mobile picker, so there is less code to get wrong.
- **Dates as `YYYY-MM-DD` strings.** They compare correctly as plain text, and "today" uses the local timezone, not UTC.
- **Storage is defensive.** Loading ignores corrupt or malformed data; saving never throws if storage is full or blocked.
- **Delete takes two clicks.** Not in the brief, but one slip shouldn't lose a task.
- **Stats ignore filters.** The headline numbers always describe the whole board.

---

## Accessibility

- Keyboard focus is always visible; inputs get a crisp sage border on focus.
- Icon-only buttons carry `aria-label`s.
- Mobile tabs follow the tab pattern (`role="tab"`, arrow keys).
- Overdue tasks say "Overdue" in text, not just in color.
- Keyboard dragging is supported by the library, but arrow keys move in small steps. The **Status** field in the edit dialog is the practical keyboard route to move a task.

---

## Known limitations

- "New task" on mobile always creates in Todo, even if another tab is open (the Status field fixes it).
- Moving a task on mobile has no confirmation or undo; the card simply leaves the current tab.
- If a filter hides the column a task is dropped into, the task disappears from view until the filter is cleared.
- Data lives only in this browser's LocalStorage: no sync, no accounts.

## What I'd do next

- Reorder cards inside a column (`useSortable` + a stored order)
- Undo toast after a move or delete
- Tests for the reducer and the derived-data logic
- Sort control and task codes from the original design