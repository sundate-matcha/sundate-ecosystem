import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User.js';
import { DEFAULT_ADMIN_USER } from '../constants/index.js';

// Load environment variables
dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sundate');
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User(DEFAULT_ADMIN_USER);

    await adminUser.save();
    console.log('Admin user created successfully:');
    console.log('Username: admin');
    console.log('Email: admin@sundate.com');
    console.log('Password: admin123');
    console.log('Role: admin');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
