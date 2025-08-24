// Simple script to create an admin user through regular signup
// Run this with: node create-admin-simple.js

const adminData = {
  firstname: 'Admin',
  lastname: 'User',
  username: 'admin',
  email: 'admin@roseheavenlysalon.com',
  address: 'Admin Address',
  phone: '09123456789',
  password: 'admin123'
};

async function createAdmin() {
  try {
    console.log('🔄 Creating admin user...');
    
    const response = await fetch('http://localhost:4000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ User created successfully!');
      console.log('📧 Email:', adminData.email);
      console.log('🔑 Password:', adminData.password);
      console.log('👤 Username:', adminData.username);
      console.log('\n⚠️  IMPORTANT: This user was created as a regular user.');
      console.log('You need to manually update the user_type to "admin" in the database.');
      console.log('\n📝 To do this, you can:');
      console.log('1. Connect to your database');
      console.log('2. Find the user with email:', adminData.email);
      console.log('3. Update user_type from "user" to "admin"');
      console.log('4. Set code to 0 (email verified)');
      console.log('\n🎉 After updating the database, you can login with these credentials!');
    } else {
      console.log('❌ Error creating user:', data.message);
      if (data.message.includes('already exists')) {
        console.log('ℹ️  User already exists. You can try logging in with:');
        console.log('📧 Email:', adminData.email);
        console.log('🔑 Password:', adminData.password);
      }
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('Make sure the backend server is running on port 4000');
  }
}

createAdmin();

