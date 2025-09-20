import React from 'react';
import type { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';
import './TaskColumn.css';

interface TaskColumnProps {
  status: TaskStatus;
  title?: string;
  tasks: Task[];
  onTaskDrop: (taskId: string, newStatus: TaskStatus) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  draggedTask: string | null;
  isStatic?: boolean;
  onDeleteColumn?: () => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  title,
  tasks,
  onTaskDrop,
  onTaskEdit,
  onTaskDelete,
  onDragStart,
  onDragEnd,
  draggedTask,
  isStatic = false,
  onDeleteColumn
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case 'TODO': return 'TODO';
      case 'IN_PROGRESS': return 'DOING';
      case 'DONE': return 'DONE';
      default: return status;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'TODO': return '#49c4e5';
      case 'IN_PROGRESS': return '#635fc7';
      case 'DONE': return '#67e2ae';
      default: return '#828fa3';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    console.log('TaskColumn drop event:', status, 'draggedTask:', draggedTask);
    if (draggedTask) {
      console.log('Calling onTaskDrop with:', draggedTask, status);
      onTaskDrop(draggedTask, status);
    }
  };

  return (
    <div 
      className={`task-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <div 
          className="status-indicator"
          style={{ backgroundColor: getStatusColor(status) }}
        />
        <h3 className="column-title">{title || getStatusLabel(status)}</h3>
        <span className="task-count">{tasks.length}</span>
        {!isStatic && onDeleteColumn && (
          <button 
            className="delete-column-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteColumn();
            }}
            title="Delete column"
          >
            ×
          </button>
        )}
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <div className="empty-column">
            <p>No tasks yet</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onTaskEdit(task)}
              onDelete={() => onTaskDelete(task.id)}
              onDragStart={() => onDragStart(task.id)}
              onDragEnd={onDragEnd}
              isDragging={draggedTask === task.id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
