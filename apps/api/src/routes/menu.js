import express from 'express';
import { body, validationResult } from 'express-validator';
import MenuItem from '../models/MenuItem.js';

const router = express.Router();

// Validation middleware
const validateMenuItem = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Item name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .isIn(['Breakfast', 'Lunch', 'Dinner', 'Beverages', 'Desserts', 'Appetizers'])
    .withMessage('Please select a valid category'),
  body('ingredients')
    .optional()
    .isArray()
    .withMessage('Ingredients must be an array'),
  body('allergens')
    .optional()
    .isArray()
    .withMessage('Allergens must be an array'),
  body('dietary')
    .optional()
    .isArray()
    .withMessage('Dietary options must be an array'),
  body('spicyLevel')
    .optional()
    .isInt({ min: 0, max: 5 })
    .withMessage('Spicy level must be between 0 and 5'),
  body('preparationTime')
    .optional()
    .isInt({ min: 1, max: 60 })
    .withMessage('Preparation time must be between 1 and 60 minutes'),
  body('calories')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Calories must be a positive number'),
  body('protein')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Protein must be a positive number'),
  body('carbs')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Carbs must be a positive number'),
  body('fat')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fat must be a positive number')
];

// GET /api/menu - Get all menu items
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      dietary, 
      maxPrice, 
      minPrice, 
      spicyLevel,
      isAvailable,
      isFeatured,
      page = 1, 
      limit = 20,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;
    
    const query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by availability
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }
    
    // Filter by featured status
    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }
    
    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Filter by spicy level
    if (spicyLevel !== undefined) {
      query.spicyLevel = parseInt(spicyLevel);
    }
    
    // Filter by dietary restrictions
    if (dietary) {
      const dietaryArray = Array.isArray(dietary) ? dietary : [dietary];
      query.dietary = { $in: dietaryArray };
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const menuItems = await MenuItem.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await MenuItem.countDocuments(query);
    
    res.json({
      menuItems,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      filters: {
        category,
        search,
        dietary,
        maxPrice,
        minPrice,
        spicyLevel,
        isAvailable,
        isFeatured
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items', message: error.message });
  }
});

// GET /api/menu/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
  }
});

// GET /api/menu/featured - Get featured menu items
router.get('/featured', async (req, res) => {
  try {
    const featuredItems = await MenuItem.getFeatured();
    res.json(featuredItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured items', message: error.message });
  }
});

// GET /api/menu/category/:category - Get menu items by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20, sortBy = 'name', sortOrder = 'asc' } = req.query;
    
    const query = { category, isAvailable: true };
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const menuItems = await MenuItem.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await MenuItem.countDocuments(query);
    
    res.json({
      category,
      menuItems,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items by category', message: error.message });
  }
});

// GET /api/menu/search - Search menu items
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const menuItems = await MenuItem.search(q)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await MenuItem.countDocuments({
      $and: [
        { isAvailable: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } }
          ]
        }
      ]
    });
    
    res.json({
      query: q,
      menuItems,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to search menu items', message: error.message });
  }
});

// GET /api/menu/dietary/:dietary - Get menu items by dietary restrictions
router.get('/dietary/:dietary', async (req, res) => {
  try {
    const { dietary } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const menuItems = await MenuItem.getByDietary([dietary])
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await MenuItem.countDocuments({
      isAvailable: true,
      dietary: { $in: [dietary] }
    });
    
    res.json({
      dietary,
      menuItems,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items by dietary restrictions', message: error.message });
  }
});

// GET /api/menu/:id - Get a specific menu item
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu item', message: error.message });
  }
});

// POST /api/menu - Create a new menu item (admin only)
router.post('/', validateMenuItem, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }
    
    const menuItem = new MenuItem(req.body);
    await menuItem.save();
    
    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to create menu item', message: error.message });
  }
});

// PUT /api/menu/:id - Update a menu item (admin only)
router.put('/:id', validateMenuItem, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }
    
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    Object.assign(menuItem, req.body);
    await menuItem.save();
    
    res.json({
      message: 'Menu item updated successfully',
      menuItem
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to update menu item', message: error.message });
  }
});

// PATCH /api/menu/:id/toggle-availability - Toggle availability (admin only)
router.patch('/:id/toggle-availability', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();
    
    res.json({
      message: `Menu item ${menuItem.isAvailable ? 'made available' : 'made unavailable'}`,
      menuItem
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle availability', message: error.message });
  }
});

// PATCH /api/menu/:id/toggle-featured - Toggle featured status (admin only)
router.patch('/:id/toggle-featured', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    menuItem.isFeatured = !menuItem.isFeatured;
    await menuItem.save();
    
    res.json({
      message: `Menu item ${menuItem.isFeatured ? 'marked as featured' : 'unmarked as featured'}`,
      menuItem
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle featured status', message: error.message });
  }
});

// DELETE /api/menu/:id - Delete a menu item (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    await MenuItem.findByIdAndDelete(req.params.id);
    
    res.json({
      message: 'Menu item deleted successfully'
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item', message: error.message });
  }
});

export default router;
