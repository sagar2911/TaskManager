import React from 'react';
import type { Board } from '../types';
import './Sidebar.css';

interface SidebarProps {
  boards: Board[];
  selectedBoardId: string | null;
  onSelectBoard: (boardId: string) => void;
  onCreateBoard: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  boards,
  selectedBoardId,
  onSelectBoard,
  onCreateBoard,
  isDarkMode,
  onToggleTheme,
  isOpen,
  onClose
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}
      
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-logo">III kanban</h1>
      </div>

      <div className="sidebar-content">
        <div className="boards-section">
          <h2 className="boards-title">ALL BOARDS ({boards.length})</h2>
          <div className="boards-list">
            {boards.map(board => (
              <button
                key={board.id}
                className={`board-item ${selectedBoardId === board.id ? 'active' : ''}`}
                onClick={() => onSelectBoard(board.id)}
              >
                <span className="board-icon">📋</span>
                <span className="board-name">{board.title}</span>
              </button>
            ))}
          </div>
        </div>

        <button 
          className="create-board-btn"
          onClick={onCreateBoard}
        >
          <span className="board-icon">📋</span>
          <span>+ Create New Board</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <div className="theme-toggle">
          <button
            className={`theme-toggle-btn ${isDarkMode ? 'dark' : 'light'}`}
            onClick={onToggleTheme}
          >
            <span className="theme-icon">☀️</span>
            <span className="theme-icon">🌙</span>
            <div className={`theme-slider ${isDarkMode ? 'dark' : 'light'}`}></div>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
