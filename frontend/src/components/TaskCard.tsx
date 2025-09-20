import React, { useState } from 'react';
import type { Task } from '../types';
import './TaskCard.css';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
  isDragging
}) => {
  const [showActions, setShowActions] = useState(false);

  // Mock subtasks data - in a real app this would come from the API
  const getSubtasks = (taskId: string) => {
    // This is mock data to match the screenshot
    const mockSubtasks = {
      'task-1': { total: 3, completed: 0 },
      'task-2': { total: 1, completed: 0 },
      'task-3': { total: 2, completed: 0 },
      'task-4': { total: 2, completed: 0 },
      'task-5': { total: 3, completed: 1 },
      'task-6': { total: 3, completed: 2 },
      'task-7': { total: 3, completed: 1 },
      'task-8': { total: 2, completed: 1 },
      'task-9': { total: 2, completed: 1 },
      'task-10': { total: 3, completed: 1 },
      'task-11': { total: 1, completed: 1 },
      'task-12': { total: 1, completed: 1 },
      'task-13': { total: 3, completed: 3 },
      'task-14': { total: 2, completed: 2 },
      'task-15': { total: 1, completed: 1 },
      'task-16': { total: 2, completed: 2 },
      'task-17': { total: 2, completed: 2 },
    };
    return mockSubtasks[taskId as keyof typeof mockSubtasks] || { total: 0, completed: 0 };
  };

  const subtasks = getSubtasks(task.id);

  return (
    <div 
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="task-content">
        <h4 className="task-title">{task.title}</h4>
        {subtasks.total > 0 && (
          <div className="task-subtasks">
            <span className="subtasks-text">
              {subtasks.completed} of {subtasks.total} subtasks
            </span>
          </div>
        )}
      </div>

      {showActions && (
        <div className="task-actions">
          <button 
            className="action-btn edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="Edit task"
          >
            ✏️
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
