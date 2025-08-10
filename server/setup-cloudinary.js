#!/usr/bin/env node

/**
 * Cloudinary Setup Helper for SkillChain
 * 
 * This script helps you set up Cloudinary credentials for file uploads.
 * 
 * To get your Cloudinary credentials:
 * 1. Go to https://cloudinary.com
 * 2. Sign up for a free account (if you don't have one)
 * 3. Go to your Dashboard
 * 4. Copy your Cloud Name, API Key, and API Secret
 * 5. Replace the values in the .env file
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 SkillChain Cloudinary Setup Helper');
console.log('=====================================\n');

const envPath = path.join(__dirname, '.env');

console.log('📋 Current .env file status:');

if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const hasCloudName = envContent.includes('CLOUDINARY_NAME=') && !envContent.includes('CLOUDINARY_NAME=your_cloudinary_cloud_name');
    const hasApiKey = envContent.includes('CLOUDINARY_API_KEY=') && !envContent.includes('CLOUDINARY_API_KEY=your_cloudinary_api_key');
    const hasApiSecret = envContent.includes('CLOUDINARY_API_SECRET=') && !envContent.includes('CLOUDINARY_API_SECRET=your_cloudinary_api_secret');
    
    console.log(`✅ .env file exists`);
    console.log(`${hasCloudName ? '✅' : '❌'} CLOUDINARY_NAME configured`);
    console.log(`${hasApiKey ? '✅' : '❌'} CLOUDINARY_API_KEY configured`);
    console.log(`${hasApiSecret ? '✅' : '❌'} CLOUDINARY_API_SECRET configured\n`);
    
    if (hasCloudName && hasApiKey && hasApiSecret) {
        console.log('🎉 Cloudinary is properly configured!');
        console.log('Your thumbnail uploads should work now.\n');
    } else {
        console.log('⚠️  Cloudinary is NOT properly configured!');
        console.log('\n📝 To fix this:');
        console.log('1. Go to https://cloudinary.com/console');
        console.log('2. Sign up/login to get your credentials');
        console.log('3. Replace the placeholder values in your .env file:');
        console.log('   - CLOUDINARY_NAME=your_actual_cloud_name');
        console.log('   - CLOUDINARY_API_KEY=your_actual_api_key');
        console.log('   - CLOUDINARY_API_SECRET=your_actual_api_secret');
        console.log('4. Restart your server\n');
    }
} else {
    console.log('❌ .env file not found!\n');
}

console.log('🔍 Troubleshooting:');
console.log('- Make sure your server is restarted after changing .env');
console.log('- Check that .env file is in the server directory');
console.log('- Verify your Cloudinary credentials are correct');
console.log('- Ensure your Cloudinary account is active\n');

console.log('📚 Need help? Check the Cloudinary documentation:');
console.log('https://cloudinary.com/documentation/node_quickstart\n');
