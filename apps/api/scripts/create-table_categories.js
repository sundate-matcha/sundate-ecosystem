import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { env } from '../src/config/env.js'
import { TABLE_CATEGORIES } from '../constants/index.js'

// Load environment variables
dotenv.config()

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(env.MONGO_URI)
    console.log('Connected to MongoDB')

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email)
      process.exit(0)
    }

    // Create admin user
    const adminUser = TABLE_CATEGORIES

    await adminUser.save()
    console.log('Admin user created successfully:')
    console.log('Username: admin')
    console.log('Email: admin@sundate.com')
    console.log('Password: admin123')
    console.log('Role: admin')

    process.exit(0)
  } catch (error) {
    console.error('Error creating admin user:', error)
    process.exit(1)
  }
}

createAdminUser()
