import React from 'react';
import { useFormState } from '../hooks';
import type { CreateColumnData } from '../types';
import { validateForm } from '../utils/validation';
import './Modal.css';

interface CreateColumnModalProps {
  boardId: string;
  onCreateColumn: (data: { title: string; boardId: string }) => Promise<any>;
  onClose: () => void;
}

const columnValidationRules = {
  title: {
    required: true,
    minLength: 1,
    maxLength: 50
  }
};

const CreateColumnModal: React.FC<CreateColumnModalProps> = ({ boardId, onCreateColumn, onClose }) => {
  const { formData, errors, isSubmitting, setIsSubmitting, updateField, setFieldError, resetForm } = useFormState<{ title: string; boardId: string }>({
    title: '',
    boardId
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData, columnValidationRules);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, error]) => {
        setFieldError(field, error);
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateColumn(formData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to create column:', error);
      setFieldError('general', 'Failed to create column. Please try again.');
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
          <h2>Create New Column</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Column Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className={errors.title ? 'error' : ''}
              placeholder="Enter column title"
              disabled={isSubmitting}
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
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
              {isSubmitting ? 'Creating...' : 'Create Column'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateColumnModal;
