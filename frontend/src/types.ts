// Board types
export interface Board {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
  columns?: Column[];
}

// Column types
export interface Column {
  id: string;
  title: string;
  status: string;
  boardId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Task types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  boardId: string;
  board?: {
    id: string;
    title: string;
  };
}

// Enums
export type TaskStatus = string; // Allow any string for custom columns
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

// Create/Update data types
export interface CreateBoardData {
  title: string;
  description?: string;
}

export interface UpdateBoardData {
  title?: string;
  description?: string;
}

export interface CreateColumnData {
  title: string;
  status: string;
  boardId: string;
}

export interface UpdateColumnData {
  title?: string;
  status?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  boardId: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
}

// API Response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any[];
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
}

