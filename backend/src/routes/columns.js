const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Validation middleware
const validateColumn = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('status')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Status must be between 1 and 50 characters'),
  body('boardId')
    .isString()
    .withMessage('Board ID is required')
];

// GET /api/columns - Get all columns (optionally filtered by board)
router.get('/', async (req, res) => {
  try {
    const { boardId } = req.query;
    
    const where = {};
    if (boardId) where.boardId = boardId;

    const columns = await prisma.column.findMany({
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
        order: 'asc'
      }
    });

    res.json({
      success: true,
      data: columns
    });
  } catch (error) {
    console.error('Error fetching columns:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch columns'
    });
  }
});

// GET /api/boards/:boardId/columns - Get columns for a specific board
router.get('/boards/:boardId', async (req, res) => {
  try {
    const { boardId } = req.params;
    
    const columns = await prisma.column.findMany({
      where: { boardId },
      orderBy: {
        order: 'asc'
      }
    });

    res.json({
      success: true,
      data: columns
    });
  } catch (error) {
    console.error('Error fetching board columns:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch board columns'
    });
  }
});

// GET /api/columns/:id - Get a specific column
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const column = await prisma.column.findUnique({
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

    if (!column) {
      return res.status(404).json({
        success: false,
        error: 'Column not found'
      });
    }

    res.json({
      success: true,
      data: column
    });
  } catch (error) {
    console.error('Error fetching column:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch column'
    });
  }
});

// POST /api/columns - Create a new column
router.post('/', validateColumn, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { title, status, boardId } = req.body;

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

    // Get the next order number
    const lastColumn = await prisma.column.findFirst({
      where: { boardId },
      orderBy: { order: 'desc' }
    });

    const order = lastColumn ? lastColumn.order + 1 : 0;

    const column = await prisma.column.create({
      data: {
        title,
        status,
        boardId,
        order
      }
    });

    res.status(201).json({
      success: true,
      data: column
    });
  } catch (error) {
    console.error('Error creating column:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create column'
    });
  }
});

// PUT /api/columns/:id - Update a column
router.put('/:id', [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('status')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Status must be between 1 and 50 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
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
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.order !== undefined) updateData.order = req.body.order;

    const column = await prisma.column.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      data: column
    });
  } catch (error) {
    console.error('Error updating column:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Column not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update column'
    });
  }
});

// DELETE /api/columns/:id - Delete a column
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.column.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Column deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting column:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Column not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to delete column'
    });
  }
});

module.exports = router;
