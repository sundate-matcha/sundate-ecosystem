import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { env } from '../src/config/env.js'
import { DEFAULT_TABLE_CATEGORIES } from '../constants/index.js'
import TableCategory from '../src/models/TableCategory.js'

// Load environment variables
dotenv.config()

const createTableCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGO_URI)
    console.log('Connected to MongoDB')

    // Check if table categories already exist
    const existingCategories = await TableCategory.find()
    if (existingCategories.length > 0) {
      console.log('Table categories already exist:', existingCategories.length, 'categories found')
      process.exit(0)
    }

    // Create table categories with sort order
    const tableCategories = DEFAULT_TABLE_CATEGORIES.map((category, index) => ({
      ...category,
      sortOrder: index + 1
    }))

    const createdCategories = await TableCategory.insertMany(tableCategories)
    console.log('Table categories created successfully:')
    createdCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} - Capacity: ${category.capacity}`)
    })

    process.exit(0)
  } catch (error) {
    console.error('Error creating table categories:', error)
    process.exit(1)
  }
}

createTableCategories()
