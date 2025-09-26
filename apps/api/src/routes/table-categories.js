import express from 'express';
import { body, validationResult } from 'express-validator';
import TableCategory from '../models/TableCategory.js';
import { authenticateToken, requireAdmin, requireStaff } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validateTableCategory = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('thumbnail')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Thumbnail cannot exceed 200 characters'),
  body('gallery')
    .optional()
    .isArray()
    .withMessage('Gallery must be an array'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('capacity')
    .isInt({ min: 1 })
    .withMessage('Capacity must be at least 1'),
  body('sortOrder')
    .isInt({ min: 0 })
    .withMessage('Sort order must be at least 0'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

// GET /api/table-categories - Get all table categories
router.get('/', async (req, res) => {
  try {
    const { 
      isActive, 
      search, 
      minCapacity, 
      maxCapacity,
      minPrice,
      maxPrice,
      page = 1, 
      limit = 20,
      sortBy = 'sortOrder',
      sortOrder = 'asc'
    } = req.query;
    
    const query = {};
    
    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    // Filter by capacity range
    if (minCapacity || maxCapacity) {
      query.capacity = {};
      if (minCapacity) query.capacity.$gte = parseInt(minCapacity);
      if (maxCapacity) query.capacity.$lte = parseInt(maxCapacity);
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const tableCategories = await TableCategory.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await TableCategory.countDocuments(query);
    
    res.json({
      tableCategories,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      filters: {
        isActive,
        search,
        minCapacity,
        maxCapacity,
        minPrice,
        maxPrice
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch table categories', message: error.message });
  }
});

// GET /api/table-categories/public - Get public table categories (active only)
router.get('/public', async (req, res) => {
  try {
    const { 
      search, 
      minCapacity, 
      maxCapacity,
      minPrice,
      maxPrice,
      page = 1, 
      limit = 20,
      sortBy = 'sortOrder',
      sortOrder = 'asc'
    } = req.query;
    
    const query = { isActive: true }; // Only show active categories
    
    // Filter by capacity range
    if (minCapacity || maxCapacity) {
      query.capacity = {};
      if (minCapacity) query.capacity.$gte = parseInt(minCapacity);
      if (maxCapacity) query.capacity.$lte = parseInt(maxCapacity);
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const tableCategories = await TableCategory.find(query)
      .select('-isActive') // Don't expose internal flags
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await TableCategory.countDocuments(query);
    
    res.json({
      tableCategories,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      filters: {
        search,
        minCapacity,
        maxCapacity,
        minPrice,
        maxPrice
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch public table categories', message: error.message });
  }
});

// GET /api/table-categories/active - Get active table categories
router.get('/active', async (req, res) => {
  try {
    const activeCategories = await TableCategory.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 })
      .exec();
    
    res.json(activeCategories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active table categories', message: error.message });
  }
});

// GET /api/table-categories/stats - Get table category statistics (admin only)
router.get('/stats', authenticateToken, requireStaff, async (req, res) => {
  try {
    const totalCategories = await TableCategory.countDocuments();
    const activeCategories = await TableCategory.countDocuments({ isActive: true });
    const inactiveCategories = await TableCategory.countDocuments({ isActive: false });
    
    // Capacity statistics
    const capacityStats = await TableCategory.aggregate([
      { $group: { _id: null, avgCapacity: { $avg: '$capacity' }, minCapacity: { $min: '$capacity' }, maxCapacity: { $max: '$capacity' } } }
    ]);
    
    // Price statistics
    const priceStats = await TableCategory.aggregate([
      { $group: { _id: null, avgPrice: { $avg: '$price' }, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } }
    ]);
    
    // Categories with gallery images
    const categoriesWithGallery = await TableCategory.countDocuments({
      gallery: { $exists: true, $not: { $size: 0 } }
    });
    
    res.json({
      totalCategories,
      activeCategories,
      inactiveCategories,
      capacityStats: capacityStats[0] || { avgCapacity: 0, minCapacity: 0, maxCapacity: 0 },
      priceStats: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 },
      categoriesWithGallery
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch table category statistics', message: error.message });
  }
});

// GET /api/table-categories/:id - Get a specific table category
router.get('/:id', async (req, res) => {
  try {
    const tableCategory = await TableCategory.findById(req.params.id);
    if (!tableCategory) {
      return res.status(404).json({ error: 'Table category not found' });
    }
    res.json(tableCategory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch table category', message: error.message });
  }
});

// POST /api/table-categories - Create a new table category (admin only)
router.post('/', authenticateToken, requireAdmin, validateTableCategory, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }
    
    // Check if a category with the same name already exists
    const existingCategory = await TableCategory.findOne({ 
      name: req.body.name.trim() 
    });
    
    if (existingCategory) {
      return res.status(400).json({
        error: 'Category already exists',
        message: 'A table category with this name already exists'
      });
    }
    
    const tableCategory = new TableCategory(req.body);
    await tableCategory.save();
    
    res.status(201).json({
      message: 'Table category created successfully',
      tableCategory
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to create table category', message: error.message });
  }
});

// PUT /api/table-categories/:id - Update a table category (admin only)
router.put('/:id', authenticateToken, requireAdmin, validateTableCategory, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }
    
    const tableCategory = await TableCategory.findById(req.params.id);
    if (!tableCategory) {
      return res.status(404).json({ error: 'Table category not found' });
    }
    
    // Check if a category with the same name already exists (excluding current category)
    if (req.body.name && req.body.name.trim() !== tableCategory.name) {
      const existingCategory = await TableCategory.findOne({ 
        name: req.body.name.trim(),
        _id: { $ne: req.params.id }
      });
      
      if (existingCategory) {
        return res.status(400).json({
          error: 'Category already exists',
          message: 'A table category with this name already exists'
        });
      }
    }
    
    Object.assign(tableCategory, req.body);
    await tableCategory.save();
    
    res.json({
      message: 'Table category updated successfully',
      tableCategory
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to update table category', message: error.message });
  }
});

// PATCH /api/table-categories/:id/toggle-active - Toggle active status (admin only)
router.patch('/:id/toggle-active', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const tableCategory = await TableCategory.findById(req.params.id);
    if (!tableCategory) {
      return res.status(404).json({ error: 'Table category not found' });
    }
    
    tableCategory.isActive = !tableCategory.isActive;
    await tableCategory.save();
    
    res.json({
      message: `Table category ${tableCategory.isActive ? 'activated' : 'deactivated'}`,
      tableCategory
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle active status', message: error.message });
  }
});

// PATCH /api/table-categories/:id/sort-order - Update sort order (admin only)
router.patch('/:id/sort-order', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { sortOrder } = req.body;
    
    if (sortOrder === undefined || sortOrder < 0) {
      return res.status(400).json({ 
        error: 'Invalid sort order', 
        message: 'Sort order must be a non-negative number' 
      });
    }
    
    const tableCategory = await TableCategory.findById(req.params.id);
    if (!tableCategory) {
      return res.status(404).json({ error: 'Table category not found' });
    }
    
    tableCategory.sortOrder = parseInt(sortOrder);
    await tableCategory.save();
    
    res.json({
      message: 'Sort order updated successfully',
      tableCategory
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sort order', message: error.message });
  }
});

// PATCH /api/table-categories/:id/gallery - Update gallery images (admin only)
router.patch('/:id/gallery', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { gallery } = req.body;
    
    if (!Array.isArray(gallery)) {
      return res.status(400).json({ 
        error: 'Invalid gallery', 
        message: 'Gallery must be an array' 
      });
    }
    
    const tableCategory = await TableCategory.findById(req.params.id);
    if (!tableCategory) {
      return res.status(404).json({ error: 'Table category not found' });
    }
    
    tableCategory.gallery = gallery;
    await tableCategory.save();
    
    res.json({
      message: 'Gallery updated successfully',
      tableCategory
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to update gallery', message: error.message });
  }
});

// DELETE /api/table-categories/:id - Delete a table category (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const tableCategory = await TableCategory.findById(req.params.id);
    if (!tableCategory) {
      return res.status(404).json({ error: 'Table category not found' });
    }
    
    // Check if there are any reservations using this table category
    // This would require a Reservation model check, but for now we'll just delete
    // In a real application, you might want to prevent deletion if there are active reservations
    
    await TableCategory.findByIdAndDelete(req.params.id);
    
    res.json({
      message: 'Table category deleted successfully'
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete table category', message: error.message });
  }
});

// POST /api/table-categories/bulk-update - Bulk update table categories (admin only)
router.post('/bulk-update', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { updates } = req.body;
    
    if (!Array.isArray(updates)) {
      return res.status(400).json({ 
        error: 'Invalid updates', 
        message: 'Updates must be an array' 
      });
    }
    
    const results = [];
    
    for (const update of updates) {
      const { id, ...updateData } = update;
      
      if (!id) {
        results.push({ id: null, error: 'ID is required for each update' });
        continue;
      }
      
      try {
        const tableCategory = await TableCategory.findByIdAndUpdate(
          id, 
          updateData, 
          { new: true, runValidators: true }
        );
        
        if (!tableCategory) {
          results.push({ id, error: 'Table category not found' });
        } else {
          results.push({ id, success: true, tableCategory });
        }
      } catch (error) {
        results.push({ id, error: error.message });
      }
    }
    
    res.json({
      message: 'Bulk update completed',
      results
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to perform bulk update', message: error.message });
  }
});

export default router;
