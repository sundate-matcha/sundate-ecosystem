import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Breakfast', 'Lunch', 'Dinner', 'Beverages', 'Desserts', 'Appetizers'],
      message: 'Please select a valid category'
    }
  },
  image: {
    type: String,
    trim: true
  },
  emoji: {
    type: String,
    default: '🍽️'
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  allergens: [{
    type: String,
    enum: ['Dairy', 'Eggs', 'Fish', 'Shellfish', 'Tree Nuts', 'Peanuts', 'Wheat', 'Soy'],
    message: 'Please select valid allergens'
  }],
  dietary: [{
    type: String,
    enum: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Kosher'],
    message: 'Please select valid dietary options'
  }],
  preparationTime: {
    type: Number,
    min: 1,
    max: 60,
    default: 15,
    validate: {
      validator: Number.isInteger,
      message: 'Preparation time must be an integer'
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  calories: {
    type: Number,
    min: 0
  },
  protein: {
    type: Number,
    min: 0
  },
  carbs: {
    type: Number,
    min: 0
  },
  fat: {
    type: Number,
    min: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted price
menuItemSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});


// Index for efficient queries
menuItemSchema.index({ category: 1, isAvailable: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });
menuItemSchema.index({ isFeatured: 1 });
menuItemSchema.index({ price: 1 });

// Static method to get items by category
menuItemSchema.statics.getByCategory = function(category) {
  return this.find({ category, isAvailable: true }).sort({ name: 1 });
};

// Static method to get featured items
menuItemSchema.statics.getFeatured = function() {
  return this.find({ isFeatured: true, isAvailable: true }).sort({ category: 1, name: 1 });
};

// Static method to search items
menuItemSchema.statics.search = function(query) {
  return this.find({
    $and: [
      { isAvailable: true },
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    ]
  }).sort({ category: 1, name: 1 });
};

// Static method to get items by dietary restrictions
menuItemSchema.statics.getByDietary = function(dietary) {
  return this.find({
    isAvailable: true,
    dietary: { $in: dietary }
  }).sort({ category: 1, name: 1 });
};

// Pre-save middleware to ensure price is positive
menuItemSchema.pre('save', function(next) {
  if (this.price < 0) {
    this.invalidate('price', 'Price cannot be negative');
  }
  next();
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;
