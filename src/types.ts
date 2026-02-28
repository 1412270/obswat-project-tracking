export type Priority = 'high' | 'medium' | 'low';
export type Status = 'TO_DO' | 'IN_PROGRESS' | 'DONE';
export type TaskLocation = 'backlog' | 'currentSprint';

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    storyPoints: number;
    assignee: string;
    status: Status;
    location: TaskLocation;
}

export interface AppState {
    tasks: Task[];
}

export type AppAction =
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
    | { type: 'MOVE_TASK_TO_SPRINT'; payload: string }
    | { type: 'MOVE_TASK_TO_BACKLOG'; payload: string }
    | { type: 'UPDATE_TASK_STATUS'; payload: { id: string; status: Status } }
    | { type: 'DELETE_TASK'; payload: string };

