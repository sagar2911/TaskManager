import React from 'react';
import { useFormState, useBoards } from '../hooks';
import type { Board, UpdateBoardData } from '../types';
import { validateForm, boardValidationRules } from '../utils/validation';
import './Modal.css';

interface EditBoardModalProps {
  board: Board;
  onClose: () => void;
}

const EditBoardModal: React.FC<EditBoardModalProps> = ({ board, onClose }) => {
  const { updateBoard, deleteBoard } = useBoards();
  const { formData, errors, isSubmitting, setIsSubmitting, updateField, setFieldError, resetForm } = useFormState<UpdateBoardData>({
    title: board.title,
    description: board.description || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData, boardValidationRules);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, error]) => {
        setFieldError(field, error);
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await updateBoard(board.id, formData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to update board:', error);
      setFieldError('general', 'Failed to update board. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      return;
    }

    try {
      setIsSubmitting(true);
      await deleteBoard(board.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete board:', error);
      setFieldError('general', 'Failed to delete board. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Board</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Board Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              className={errors.title ? 'error' : ''}
              placeholder="Enter board title"
              disabled={isSubmitting}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              className={errors.description ? 'error' : ''}
              placeholder="Enter board description (optional)"
              rows={3}
              disabled={isSubmitting}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Board'}
            </button>
            <div className="modal-actions-right">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBoardModal;
