import type { 
  Board, 
  Task, 
  Column,
  CreateBoardData, 
  UpdateBoardData, 
  CreateTaskData, 
  UpdateTaskData,
  CreateColumnData,
  UpdateColumnData,
  ApiResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Board methods
  async getBoards(): Promise<ApiResponse<Board[]>> {
    return this.request<Board[]>('/boards');
  }

  async getBoard(id: string): Promise<ApiResponse<Board>> {
    return this.request<Board>(`/boards/${id}`);
  }

  async createBoard(data: CreateBoardData): Promise<ApiResponse<Board>> {
    return this.request<Board>('/boards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBoard(id: string, data: UpdateBoardData): Promise<ApiResponse<Board>> {
    return this.request<Board>(`/boards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBoard(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/boards/${id}`, {
      method: 'DELETE',
    });
  }

  // Task methods
  async getTasks(boardId?: string, status?: string): Promise<ApiResponse<Task[]>> {
    const params = new URLSearchParams();
    if (boardId) params.append('boardId', boardId);
    if (status) params.append('status', status);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    
    return this.request<Task[]>(endpoint);
  }

  async getTask(id: string): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/tasks/${id}`);
  }

  async createTask(data: CreateTaskData): Promise<ApiResponse<Task>> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: UpdateTaskData): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Column methods
  async getColumns(boardId: string): Promise<ApiResponse<Column[]>> {
    return this.request<Column[]>(`/columns/boards/${boardId}`);
  }

  async getColumn(id: string): Promise<ApiResponse<Column>> {
    return this.request<Column>(`/columns/${id}`);
  }

  async createColumn(data: CreateColumnData): Promise<ApiResponse<Column>> {
    return this.request<Column>('/columns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateColumn(id: string, data: UpdateColumnData): Promise<ApiResponse<Column>> {
    return this.request<Column>(`/columns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteColumn(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/columns/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
