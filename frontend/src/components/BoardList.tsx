import React from 'react';
import type { Board } from '../types';
import './BoardList.css';

interface BoardListProps {
  boards: Board[];
  onSelectBoard: (boardId: string) => void;
  onCreateBoard: () => void;
}

const BoardList: React.FC<BoardListProps> = ({ 
  onCreateBoard 
}) => {
  return (
    <div className="board-list">
      <div className="board-list-header">
        <h2>Welcome to your Kanban Board</h2>
        <p>Select a board from the sidebar to get started, or create a new one.</p>
      </div>

      <div className="welcome-content">
        <div className="welcome-card">
          <div className="welcome-icon">📋</div>
          <h3>Get Started</h3>
          <p>Choose a board from the sidebar to view and manage your tasks, or create a new board to organize your work.</p>
          <button 
            className="btn btn-primary btn-large"
            onClick={onCreateBoard}
          >
            Create New Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoardList;
