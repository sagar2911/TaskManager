const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Validation middleware
const validateBoard = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
];

// GET /api/boards - Get all boards
router.get('/', async (req, res) => {
  try {
    const boards = await prisma.board.findMany({
      include: {
        tasks: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: boards
    });
  } catch (error) {
    console.error('Error fetching boards:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch boards'
    });
  }
});

// GET /api/boards/:id - Get a specific board
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    if (!board) {
      return res.status(404).json({
        success: false,
        error: 'Board not found'
      });
    }

    res.json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch board'
    });
  }
});

// POST /api/boards - Create a new board
router.post('/', validateBoard, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { title, description } = req.body;

    const board = await prisma.board.create({
      data: {
        title,
        description
      },
      include: {
        tasks: true
      }
    });

    res.status(201).json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error creating board:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create board'
    });
  }
});

// PUT /api/boards/:id - Update a board
router.put('/:id', validateBoard, async (req, res) => {
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
    const { title, description } = req.body;

    const board = await prisma.board.update({
      where: { id },
      data: {
        title,
        description
      },
      include: {
        tasks: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      }
    });

    res.json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error updating board:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Board not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update board'
    });
  }
});

// DELETE /api/boards/:id - Delete a board
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.board.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Board deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting board:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Board not found'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to delete board'
    });
  }
});

module.exports = router;

