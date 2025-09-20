import React from 'react';
import { useFormState } from '../hooks';
import type { CreateTaskData, Priority, TaskStatus } from '../types';
import { validateForm, taskValidationRules } from '../utils/validation';
import './Modal.css';

interface CreateTaskModalProps {
  boardId: string;
  onCreateTask: (data: CreateTaskData) => Promise<any>;
  onClose: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ boardId, onCreateTask, onClose }) => {
  const { formData, errors, isSubmitting, setIsSubmitting, updateField, setFieldError, resetForm } = useFormState<CreateTaskData>({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    boardId
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData, taskValidationRules);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, error]) => {
        setFieldError(field, error);
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onCreateTask(formData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
      setFieldError('general', 'Failed to create task. Please try again.');
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
          <h2>Create New Task</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className={errors.title ? 'error' : ''}
              placeholder="Enter task title"
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
              placeholder="Enter task description (optional)"
              rows={3}
              disabled={isSubmitting}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => updateField('status', e.target.value as TaskStatus)}
                disabled={isSubmitting}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => updateField('priority', e.target.value as Priority)}
                disabled={isSubmitting}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
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
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
