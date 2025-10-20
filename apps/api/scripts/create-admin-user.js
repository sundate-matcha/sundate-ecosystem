#!/usr/bin/env node

/**
 * Create an admin user for testing SSE functionality
 * 
 * This script creates an admin user that can receive SSE events
 * when no specific userId is provided.
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../src/models/User.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sundate')
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message)
    process.exit(1)
  }
}

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists:', existingAdmin.email)
      return existingAdmin
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = new User({
      username: 'admin',
      email: 'admin@sundate.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true
    })

    await adminUser.save()
    console.log('✅ Admin user created successfully:')
    console.log(`   Email: ${adminUser.email}`)
    console.log(`   Password: admin123`)
    console.log(`   User ID: ${adminUser._id}`)
    console.log(`   Role: ${adminUser.role}`)
    
    return adminUser
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    throw error
  }
}

const main = async () => {
  try {
    await connectDB()
    const adminUser = await createAdminUser()
    
    console.log('\n🎉 Admin user setup complete!')
    console.log('You can now test SSE events that will be sent to all admin users.')
    console.log('Use the admin user ID in your SSE connections or leave userId empty to send to all admins.')
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 Database connection closed')
  }
}

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { createAdminUser }
