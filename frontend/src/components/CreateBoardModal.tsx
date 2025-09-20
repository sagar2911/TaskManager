import React from 'react';
import { useFormState } from '../hooks';
import type { CreateBoardData } from '../types';
import { validateForm, boardValidationRules } from '../utils/validation';
import './Modal.css';

interface CreateBoardModalProps {
  onCreateBoard: (data: CreateBoardData) => Promise<any>;
  onClose: () => void;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ onCreateBoard, onClose }) => {
  const { formData, errors, isSubmitting, setIsSubmitting, updateField, setFieldError, resetForm } = useFormState<CreateBoardData>({
    title: '',
    description: ''
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
      await onCreateBoard(formData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to create board:', error);
      setFieldError('general', 'Failed to create board. Please try again.');
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
          <h2>Create New Board</h2>
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
              value={formData.title}
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
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Creating...' : 'Create Board'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;
