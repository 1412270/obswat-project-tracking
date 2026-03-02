export type Priority = 'high' | 'medium' | 'low';
export type Status = string;
export type TaskLocation = 'backlog' | 'currentSprint';

export interface BoardColumn {
    id: string;
    title: string;
}

export interface Subtask {
    id: string;
    name: string;
    assignees: string[];
    tags: string[];
    status: Status;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: Priority;
    storyPoints: number;
    assignees: string[];
    status: Status;
    location: TaskLocation;
    dueDate?: string;
    tags: string[];
    subtasks: Subtask[];
}

export interface Sprint {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
}

export interface AppState {
    tasks: Task[];
    currentSprint: Sprint;
    boardColumns: BoardColumn[];
}

export type AppAction =
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
    | { type: 'MOVE_TASK_TO_SPRINT'; payload: string }
    | { type: 'MOVE_TASK_TO_BACKLOG'; payload: string }
    | { type: 'UPDATE_TASK_STATUS'; payload: { id: string; status: Status } }
    | { type: 'DELETE_TASK'; payload: string }
    | { type: 'ADD_BOARD_COLUMN'; payload: BoardColumn }
    | { type: 'REMOVE_BOARD_COLUMN'; payload: { id: string } }
    | { type: 'REORDER_BOARD_COLUMNS'; payload: BoardColumn[] };

