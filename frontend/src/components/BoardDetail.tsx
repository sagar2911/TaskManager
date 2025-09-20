import React, { useState } from 'react';
import type { Board, TaskStatus, Task } from '../types';
import { useTasks, useColumns } from '../hooks';
import TaskColumn from './TaskColumn';
import CreateTaskModal from './CreateTaskModal';
import EditTaskModal from './EditTaskModal';
import CreateColumnModal from './CreateColumnModal';
import EditBoardModal from './EditBoardModal';
import './BoardDetail.css';

interface BoardDetailProps {
  board: Board;
  onBack: () => void;
  onCreateTask?: () => void;
}

const BoardDetail: React.FC<BoardDetailProps> = ({ board }) => {
  const { tasks, createTask, updateTask, deleteTask } = useTasks(board.id);
  const { columns, createColumn, deleteColumn } = useColumns(board.id);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const [showEditBoard, setShowEditBoard] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Always include static columns
  const staticStatuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
  
  // Combine static statuses with custom columns
  const allStatuses = [
    ...staticStatuses,
    ...columns.map(col => col.status)
  ];


  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  const handleTaskDrop = async (taskId: string, newStatus: TaskStatus) => {
    try {
      console.log('Dropping task:', taskId, 'to status:', newStatus);
      await updateTask(taskId, { status: newStatus });
      console.log('Task dropped successfully');
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setShowEditTask(true);
  };

  const handleCloseEditTask = () => {
    setEditingTask(null);
    setShowEditTask(false);
  };

  const handleCreateColumn = async (data: { title: string }) => {
    try {
      // Generate a unique status based on the title
      const status = data.title.toUpperCase().replace(/\s+/g, '_');
      
      await createColumn({
        title: data.title,
        status: status,
        boardId: board.id
      });
      
      setShowCreateColumn(false);
    } catch (error) {
      console.error('Failed to create column:', error);
      // The error will be handled by the modal's error state
    }
  };

  return (
    <div className="board-detail">
      <div className="board-header">
        <h1>{board.title}</h1>
        <div className="board-header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateTask(true)}
          >
            + Add New Task
          </button>
          <button className="board-menu-btn">
            ⋮
          </button>
        </div>
      </div>

      <div className="kanban-board">
        {allStatuses.map(status => {
          const column = columns.find(col => col.status === status);
          const isStatic = staticStatuses.includes(status);
          return (
            <TaskColumn
              key={status}
              status={status}
              title={column?.title || status}
              tasks={getTasksByStatus(status)}
              onTaskDrop={handleTaskDrop}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={deleteTask}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              draggedTask={draggedTask}
              isStatic={isStatic}
              onDeleteColumn={isStatic ? undefined : () => deleteColumn(column?.id || '')}
            />
          );
        })}
        
        {/* Add New Column Button */}
        <div className="add-column">
          <button 
            className="add-column-btn"
            onClick={() => setShowCreateColumn(true)}
          >
            + New Column
          </button>
        </div>
      </div>

      {showCreateTask && (
        <CreateTaskModal
          boardId={board.id}
          onCreateTask={createTask}
          onClose={() => setShowCreateTask(false)}
        />
      )}

      {showEditTask && editingTask && (
        <EditTaskModal
          task={editingTask}
          onUpdateTask={updateTask}
          onClose={handleCloseEditTask}
        />
      )}

      {showCreateColumn && (
        <CreateColumnModal
          boardId={board.id}
          onCreateColumn={handleCreateColumn}
          onClose={() => setShowCreateColumn(false)}
        />
      )}

      {showEditBoard && (
        <EditBoardModal
          board={board}
          onClose={() => setShowEditBoard(false)}
        />
      )}
    </div>
  );
};

export default BoardDetail;
