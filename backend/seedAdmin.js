const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // Make sure we connect without deprecated connection options
    await mongoose.connect(process.env.MONGODB_URI);

    const email = 'admin@Reet Jewelers 916.com';
    const password = 'admin123';

    // Check if the admin already exists
    const adminExists = await Admin.findOne({ email });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const admin = new Admin({ email, password: hashedPassword });
      await admin.save();
      console.log('Successfully created initial admin user!');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
    } else {
      console.log('Admin user already exists!');
    }

  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    // Unplug properly
    mongoose.disconnect();
  }
};

seedAdmin();
