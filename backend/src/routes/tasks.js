const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Validation middleware
const validateTask = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('status')
    .optional()
    .isString()
    .withMessage('Status must be a string'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Priority must be LOW, MEDIUM, or HIGH'),
  body('boardId')
    .isString()
    .withMessage('Board ID is required')
];

// GET /api/tasks - Get all tasks (optionally filtered by board)
router.get('/', async (req, res) => {
  try {
    const { boardId, status } = req.query;
    
    const where = {};
    if (boardId) where.boardId = boardId;
    if (status) where.status = status;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        board: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
});

// GET /api/tasks/:id - Get a specific task
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        board: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task'
    });
  }
});

// POST /api/tasks - Create a new task
router.post('/', validateTask, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { title, description, status, priority, boardId } = req.body;

    // Verify board exists
    const board = await prisma.board.findUnique({
      where: { id: boardId }
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        error: 'Board not found'
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        boardId
      },
      include: {
        board: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('status')
    .optional()
    .isString()
    .withMessage('Status must be a string'),
  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH'])
    .withMessage('Priority must be LOW, MEDIUM, or HIGH')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = {};

    // Only include fields that are provided
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.priority !== undefined) updateData.priority = req.body.priority;

    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        board: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update task'
    });
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to delete task'
    });
  }
});

module.exports = router;

