import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import type { Column, CreateColumnData, UpdateColumnData } from '../types';

export const useColumns = (boardId: string) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchColumns = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getColumns(boardId);
      
      if (response.success && response.data) {
        setColumns(response.data);
      } else {
        setError(response.error || 'Failed to fetch columns');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch columns');
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  const createColumn = useCallback(async (data: CreateColumnData) => {
    try {
      setError(null);
      const response = await apiService.createColumn(data);
      
      if (response.success && response.data) {
        setColumns(prev => [...prev, response.data!]);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create column');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create column';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateColumn = useCallback(async (id: string, data: UpdateColumnData) => {
    try {
      setError(null);
      const response = await apiService.updateColumn(id, data);
      if (response.success && response.data) {
        setColumns(prev => prev.map(col => 
          col.id === id ? response.data! : col
        ));
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update column');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update column';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteColumn = useCallback(async (id: string) => {
    try {
      setError(null);
      const response = await apiService.deleteColumn(id);
      if (response.success) {
        setColumns(prev => prev.filter(col => col.id !== id));
      } else {
        throw new Error(response.error || 'Failed to delete column');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete column';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    if (boardId) {
      fetchColumns();
    }
  }, [boardId, fetchColumns]);

  return {
    columns,
    loading,
    error,
    createColumn,
    updateColumn,
    deleteColumn,
    refetch: fetchColumns
  };
};
