# Project Tracking - Jira-like Backlog & Board

A single-page React application that mimics a Jira backlog and Kanban board for project tracking.

## Features

### Backlog Tab
- **Current Sprint** (collapsible): Shows tasks in the current sprint
- **Backlog** (collapsible): Shows tasks in the backlog
- **Drag & Drop**: Move tasks between Backlog and Current Sprint
- **Task Display**: Each task shows:
  - ID
  - Title
  - Priority badge (high/medium/low)
  - Story points
  - Assignees with avatar circle
  - Expandable subtasks list

### Board Tab (Kanban)
- **Dynamic Columns**: Add, remove, and drag to reorder columns
- **Task Cards**: Display title, description, priority, story points, assignees, and subtasks
- **Drag & Drop**: Move tasks between columns
- **Create Task**: "+" button opens a modal form to create new tasks
- **Delete Task**: Delete with confirmation modal

## Technologies

- **React** with **Vite** (fast development)
- **TypeScript** for type safety
- **State Management**: React Context + useReducer
- **UI Library**: Material-UI (MUI)
- **Drag & Drop**: @dnd-kit/core

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── Backlog.tsx     # Backlog view with drag & drop
│   ├── Board.tsx       # Kanban board view
│   ├── TaskCard.tsx    # Task card for board view
│   ├── BacklogTaskCard.tsx  # Task card for backlog view
│   ├── CreateTaskModal.tsx  # Modal for creating tasks
│   ├── SortableTaskCard.tsx # Sortable wrapper for board tasks
│   └── SortableBacklogTask.tsx # Sortable wrapper for backlog tasks
├── context/            # State management
│   └── AppContext.tsx  # Context + useReducer setup
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Demo Data

The application comes with pre-populated demo tasks to showcase functionality. All data is stored in memory (no backend).

## Notes

- This is a demo application with no backend or authentication
- All data is stored in React state and will be lost on page refresh
- Perfect for demonstrating UI/UX and drag & drop functionality

