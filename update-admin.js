// Prisma script to update user to admin
// Run this from the backend directory: node update-admin.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateToAdmin() {
  try {
    console.log('🔄 Updating user to admin...');
    
    const updatedUser = await prisma.user.update({
      where: { email: 'admin@roseheavenlysalon.com' },
      data: {
        user_type: 'admin',
        code: 0 // Email verified
      }
    });

    console.log('✅ User updated successfully!');
    console.log('👤 Username:', updatedUser.username);
    console.log('📧 Email:', updatedUser.email);
    console.log('🔑 User Type:', updatedUser.user_type);
    console.log('✅ Email Verified:', updatedUser.code === 0 ? 'Yes' : 'No');
    
    console.log('\n🎉 Admin credentials:');
    console.log('📧 Email: admin@roseheavenlysalon.com');
    console.log('🔑 Password: admin123');
    console.log('\n📍 Admin Portal URL: http://localhost:3001');
    
  } catch (error) {
    console.log('❌ Error updating user:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateToAdmin();

