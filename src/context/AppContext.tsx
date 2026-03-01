import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction } from '../types';

const initialState: AppState = {
  currentSprint: {
    id: '1',
    name: 'Sprint 1',
    startDate: new Date().toISOString().split('T')[0], // Today's date
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
  },
  tasks: [
    {
      id: '1',
      title: 'Implement user authentication',
      description: 'Add login and registration functionality',
      priority: 'high',
      storyPoints: 8,
      assignee: 'John Doe',
      status: 'TO_DO',
      location: 'currentSprint',
      tags: ['BE', 'Feature'],
    },
    {
      id: '2',
      title: 'Design dashboard UI',
      description: 'Create mockups and implement dashboard components',
      priority: 'medium',
      storyPoints: 5,
      assignee: 'Jane Smith',
      status: 'IN_PROGRESS',
      location: 'currentSprint',
      tags: ['FE', 'Design'],
    },
    {
      id: '3',
      title: 'Write API documentation',
      description: 'Document all REST API endpoints',
      priority: 'low',
      storyPoints: 3,
      assignee: 'Bob Johnson',
      status: 'DONE',
      location: 'currentSprint',
      tags: ['Documentation'],
    },
    {
      id: '4',
      title: 'Add unit tests',
      description: 'Write tests for core functionality',
      priority: 'high',
      storyPoints: 5,
      assignee: 'Alice Brown',
      status: 'TO_DO',
      location: 'backlog',
      tags: ['Testing'],
    },
    {
      id: '5',
      title: 'Optimize database queries',
      description: 'Review and optimize slow queries',
      priority: 'medium',
      storyPoints: 3,
      assignee: 'Charlie Wilson',
      status: 'TO_DO',
      location: 'backlog',
      tags: ['BE', 'Enhancement'],
    },
  ],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };
    case 'MOVE_TASK_TO_SPRINT':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, location: 'currentSprint' as const }
            : task
        ),
      };
    case 'MOVE_TASK_TO_BACKLOG':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, location: 'backlog' as const }
            : task
        ),
      };
    case 'UPDATE_TASK_STATUS':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? { ...task, status: action.payload.status }
            : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

