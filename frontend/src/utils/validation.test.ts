import { describe, it, expect } from 'vitest';
import { validateField, validateForm } from './validation';

describe('Validation Utils', () => {
  describe('validateField', () => {
    it('should validate required fields', () => {
      const result = validateField('', { required: true });
      expect(result).toBe('This field is required');
    });

    it('should validate minLength', () => {
      const result = validateField('ab', { minLength: 3 });
      expect(result).toBe('Must be at least 3 characters');
    });

    it('should validate maxLength', () => {
      const result = validateField('abcdef', { maxLength: 5 });
      expect(result).toBe('Must be no more than 5 characters');
    });

    it('should return null for valid input', () => {
      const result = validateField('valid input', { required: true, minLength: 3 });
      expect(result).toBeNull();
    });
  });

  describe('validateForm', () => {
    it('should validate entire form', () => {
      const data = { title: '', description: 'Valid description' };
      const rules = {
        title: { required: true },
        description: { maxLength: 10 }
      };
      
      const errors = validateForm(data, rules);
      expect(errors).toHaveProperty('title');
      expect(errors).toHaveProperty('description');
    });

    it('should return empty object for valid form', () => {
      const data = { title: 'Valid title', description: 'Valid description' };
      const rules = {
        title: { required: true, minLength: 3 },
        description: { maxLength: 100 }
      };
      
      const errors = validateForm(data, rules);
      expect(Object.keys(errors)).toHaveLength(0);
    });
  });
});

