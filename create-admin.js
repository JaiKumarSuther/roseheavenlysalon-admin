// Simple script to create an admin user
// Run this with: node create-admin.js

const adminData = {
  username: 'admin',
  email: 'admin@roseheavenlysalon.com',
  phone: '09123456789',
  password: 'admin123'
};

async function createAdmin() {
  try {
    const response = await fetch('http://localhost:4000/api/admin/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adminData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email:', adminData.email);
      console.log('🔑 Password:', adminData.password);
      console.log('👤 Username:', adminData.username);
      console.log('\n🎉 You can now login to the admin portal with these credentials!');
    } else {
      console.log('❌ Error creating admin:', data.message);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
    console.log('Make sure the backend server is running on port 4000');
  }
}

createAdmin();


