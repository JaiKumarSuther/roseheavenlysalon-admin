// Script to create the first admin user directly in the database
// This bypasses the authentication requirement for the first admin

import bcrypt from 'bcryptjs';

const adminData = {
  username: 'admin',
  email: 'admin@roseheavenlysalon.com',
  phone: '09123456789',
  password: 'admin123',
  firstname: 'Admin',
  lastname: 'User'
};

async function createFirstAdmin() {
  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(adminData.password, 10);
    
    // Create the admin user data
    const userData = {
      username: adminData.username,
      email: adminData.email,
      phone: adminData.phone,
      password: passwordHash,
      firstname: adminData.firstname,
      lastname: adminData.lastname,
      user_type: 'admin',
      code: 0, // Email verified
      address1: 'Admin Address'
    };

    // Send the request to create admin
    const response = await fetch('http://localhost:4000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email:', adminData.email);
      console.log('🔑 Password:', adminData.password);
      console.log('👤 Username:', adminData.username);
      console.log('\n🎉 You can now login to the admin portal with these credentials!');
      console.log('\n📍 Admin Portal URL: http://localhost:3001');
    } else {
      console.log('❌ Error creating admin:', data.message);
      if (data.message.includes('already exists')) {
        console.log('ℹ️  Admin user already exists. You can use these credentials:');
        console.log('📧 Email:', adminData.email);
        console.log('🔑 Password:', adminData.password);
      }
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('Make sure the backend server is running on port 4000');
  }
}

createFirstAdmin();

