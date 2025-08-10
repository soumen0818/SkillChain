📋 **Cloudinary Setup Instructions for SkillChain**

## 🚨 Current Issue
Your thumbnail uploads are failing because Cloudinary credentials are not configured.

## 🔧 Quick Fix (5 minutes):

### Step 1: Get Cloudinary Credentials
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a **FREE** account (no credit card required)
3. After signup, you'll see your **Dashboard**
4. Copy these three values:
   - **Cloud name** (e.g., "abc123")
   - **API Key** (e.g., "123456789012345")
   - **API Secret** (e.g., "abcdef1234567890")

### Step 2: Update Your .env File
Open `server/.env` and replace these lines:
```
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

With your actual values:
```
CLOUDINARY_NAME=abc123
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdef1234567890
```

### Step 3: Restart Your Server
```bash
# In server directory
npm run server
```

### Step 4: Test Upload
- Try uploading a thumbnail again
- Should work without errors! 🎉

## 🔍 Verification
Run this command to check your setup:
```bash
cd server
npm run setup
```

## ❓ Need Help?
- Free Cloudinary account: 25GB storage, 25GB bandwidth/month
- Documentation: https://cloudinary.com/documentation/node_quickstart
- The setup is complete once thumbnails upload successfully

## 🎯 This fixes:
- ✅ Thumbnail upload errors
- ✅ Course creation workflow
- ✅ Media management for SkillChain
