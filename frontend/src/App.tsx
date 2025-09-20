import { useState } from 'react';
import { useBoards } from './hooks';
import BoardList from './components/BoardList';
import BoardDetail from './components/BoardDetail';
import CreateBoardModal from './components/CreateBoardModal';
import Sidebar from './components/Sidebar';
import './styles/App.css';

function App() {
  const { boards, loading, error, createBoard } = useBoards();
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCreateBoard = async (data: any) => {
    try {
      const newBoard = await createBoard(data);
      if (newBoard) {
        setSelectedBoardId(newBoard.id);
        setShowCreateModal(false);
        setIsSidebarOpen(false); // Close sidebar on mobile after creating board
      }
    } catch (error) {
      console.error('Failed to create board:', error);
    }
  };

  const handleSelectBoard = (boardId: string) => {
    setSelectedBoardId(boardId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selecting board
  };

  if (loading) {
    return (
      <div className={`app ${isDarkMode ? 'dark' : ''}`}>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading boards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`app ${isDarkMode ? 'dark' : ''}`}>
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const selectedBoard = selectedBoardId 
    ? boards.find(board => board.id === selectedBoardId)
    : null;

  return (
    <div className={`app ${isDarkMode ? 'dark' : ''}`}>
      <div className="app-layout">
        <Sidebar 
          boards={boards}
          selectedBoardId={selectedBoardId}
          onSelectBoard={handleSelectBoard}
          onCreateBoard={() => setShowCreateModal(true)}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="app-main">
          {/* Mobile hamburger menu */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          >
            ☰
          </button>
          
          {selectedBoard ? (
            <BoardDetail 
              board={selectedBoard}
              onBack={() => setSelectedBoardId(null)}
              onCreateTask={() => {/* Will be handled in BoardDetail */}}
            />
          ) : (
            <BoardList 
              boards={boards}
              onSelectBoard={handleSelectBoard}
              onCreateBoard={() => setShowCreateModal(true)}
            />
          )}
        </main>
      </div>

      {showCreateModal && (
        <CreateBoardModal
          onCreateBoard={handleCreateBoard}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}

export default App;