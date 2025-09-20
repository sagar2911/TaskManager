import { useState, useEffect, useCallback } from 'react';
import type { Board, Task, CreateBoardData, UpdateBoardData, CreateTaskData, UpdateTaskData } from '../types';
import { apiService } from '../services/api';

// Re-export the useColumns hook
export { useColumns } from './useColumns';

// Board hooks
export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBoards();
      if (response.success && response.data) {
        setBoards(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch boards');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBoard = useCallback(async (data: CreateBoardData) => {
    try {
      const response = await apiService.createBoard(data);
      if (response.success && response.data) {
        setBoards(prev => [response.data!, ...prev]);
        return response.data;
      }
    } catch (err) {
      throw err;
    }
  }, []);

  const updateBoard = useCallback(async (id: string, data: UpdateBoardData) => {
    try {
      const response = await apiService.updateBoard(id, data);
      if (response.success && response.data) {
        setBoards(prev => prev.map(board => 
          board.id === id ? response.data! : board
        ));
        return response.data;
      }
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteBoard = useCallback(async (id: string) => {
    try {
      await apiService.deleteBoard(id);
      setBoards(prev => prev.filter(board => board.id !== id));
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return {
    boards,
    loading,
    error,
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard
  };
};

export const useBoard = (id: string) => {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getBoard(id);
      if (response.success && response.data) {
        setBoard(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch board');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  return { board, loading, error, fetchBoard };
};

// Task hooks
export const useTasks = (boardId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getTasks(boardId);
      if (response.success && response.data) {
        setTasks(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  const createTask = useCallback(async (data: CreateTaskData) => {
    try {
      const response = await apiService.createTask(data);
      if (response.success && response.data) {
        setTasks(prev => [...prev, response.data!]);
        return response.data;
      }
    } catch (err) {
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id: string, data: UpdateTaskData) => {
    try {
      console.log('useTasks: Updating task', id, 'with data:', data);
      const response = await apiService.updateTask(id, data);
      console.log('useTasks: Update response:', response);
      if (response.success && response.data) {
        setTasks(prev => prev.map(task => 
          task.id === id ? response.data! : task
        ));
        return response.data;
      }
    } catch (err) {
      console.error('useTasks: Error updating task:', err);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await apiService.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
};

// Utility hook for form state
export const useFormState = <T>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  }, [errors]);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setErrors({});
    setIsSubmitting(false);
  }, [initialState]);

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    setFieldError,
    clearErrors,
    resetForm
  };
};
