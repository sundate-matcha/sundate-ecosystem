import mongoose from 'mongoose';

const tableCategorySchema = new mongoose.Schema({
  sortOrder: {
    type: Number,
    required: [true, 'Sort order is required'],
    min: [0, 'Sort order must be at least 0'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: '',
  },
  thumbnail: {
    type: String,
    maxlength: [200, 'Thumbnail cannot exceed 200 characters'],
    default: '',
  },
  gallery: {
    type: Array,
    default: [],
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    default: 0,
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
  },
  // the availability is dynamic (by time slot), so we don't need to store it in the database
  // available: {
  //   type: Number,
  //   required: [true, 'Available tables is required'],
  //   min: [0, 'Available tables must be at least 0'],
  // },
  isActive: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const TableCategory = mongoose.model('TableCategory', tableCategorySchema);

export default TableCategory;
