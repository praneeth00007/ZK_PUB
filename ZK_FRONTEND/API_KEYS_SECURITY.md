# API Keys Security Guide

## 🔐 Security Overview

This project uses a centralized API keys configuration system to keep your sensitive API keys secure and organized.

## 📁 File Structure

```
src/config/
├── apiKeys.js          # Your actual API keys (NEVER commit this)
├── apiKeys.template.js # Template file (safe to commit)
└── blockchain.js       # Blockchain configuration
```

## 🛡️ Security Features

### 1. **Automatic Git Exclusion**
- `apiKeys.js` is automatically added to `.gitignore`
- Your API keys will never be committed to version control
- Template file is safe to commit for team collaboration

### 2. **Centralized Configuration**
- All API keys in one place for easy management
- Easy to update and maintain
- Clear separation from other configuration

### 3. **Validation System**
- Built-in validation to check if keys are configured
- Helpful error messages for missing keys
- Development vs production key handling

## 🔑 Current API Keys

### **API Ninjas** (Required)
- **Purpose**: Image-to-text OCR for ID document processing
- **Key**: `Yq2RTy89hZ1ucsqvCqQotA==gn0wjsRcpLX8G834`
- **Status**: ✅ Configured
- **Get your key**: https://api-ninjas.com/

### **OpenAI** (Optional)
- **Purpose**: Advanced text processing and analysis
- **Status**: ❌ Not configured
- **Get your key**: https://platform.openai.com/

### **Google Vision** (Optional)
- **Purpose**: Alternative OCR service
- **Status**: ❌ Not configured
- **Get your key**: https://cloud.google.com/vision

### **AWS Rekognition** (Optional)
- **Purpose**: Alternative OCR service
- **Status**: ❌ Not configured
- **Get your key**: https://aws.amazon.com/rekognition/

## 🚀 Setup Instructions

### 1. **Initial Setup**
```bash
npm run zk:setup-keys
```

### 2. **Configure Your Keys**
Edit `src/config/apiKeys.js`:
```javascript
export const API_KEYS = {
  API_NINJAS: 'Yq2RTy89hZ1ucsqvCqQotA==gn0wjsRcpLX8G834',
  OPENAI: 'your_openai_key_here',
  // ... other keys
};
```

### 3. **Verify Configuration**
```bash
npm run zk:setup-keys
```

## 🔒 Security Best Practices

### **Development**
- ✅ Use the centralized `apiKeys.js` file
- ✅ Keep keys in the excluded file
- ✅ Never commit `apiKeys.js` to git
- ✅ Use different keys for development and production

### **Production Deployment**
- ✅ Use environment variables for production
- ✅ Never hardcode keys in production code
- ✅ Use secure key management services
- ✅ Rotate keys regularly

### **Team Collaboration**
- ✅ Share the template file (`apiKeys.template.js`)
- ✅ Each developer creates their own `apiKeys.js`
- ✅ Never share actual API keys in chat/email
- ✅ Use secure communication for key sharing

## 🛠️ Management Commands

### **Check Current Configuration**
```bash
npm run zk:setup-keys
```

### **Update API Keys**
1. Edit `src/config/apiKeys.js`
2. Run `npm run zk:setup-keys` to verify

### **Add New API Keys**
1. Add to `apiKeys.template.js` (for team)
2. Add to your `apiKeys.js` (for local use)
3. Update validation in both files

## 🚨 Security Warnings

### **Never Do This:**
- ❌ Commit `apiKeys.js` to version control
- ❌ Share API keys in chat or email
- ❌ Use production keys in development
- ❌ Hardcode keys in frontend code
- ❌ Store keys in public repositories

### **Always Do This:**
- ✅ Use the centralized configuration
- ✅ Keep keys in excluded files
- ✅ Use environment variables for production
- ✅ Rotate keys regularly
- ✅ Monitor API key usage

## 🔍 Troubleshooting

### **"API key not configured" Error**
1. Check if `apiKeys.js` exists
2. Verify the key is properly set
3. Run `npm run zk:setup-keys` to check status

### **"API request failed" Error**
1. Verify the API key is correct
2. Check if the service is available
3. Ensure you have sufficient quota

### **"File not found" Error**
1. Run `npm run zk:setup-keys` to create the file
2. Check file permissions
3. Verify the file path is correct

## 📞 Support

If you encounter issues with API keys:

1. **Check the configuration**: `npm run zk:setup-keys`
2. **Verify the key**: Test with the API provider
3. **Check quotas**: Ensure you have sufficient API quota
4. **Review logs**: Check browser console for detailed errors

## 🔄 Key Rotation

### **When to Rotate Keys:**
- Every 90 days (recommended)
- If a key is compromised
- When changing team members
- Before production deployment

### **How to Rotate:**
1. Generate new key from API provider
2. Update `apiKeys.js` with new key
3. Test the new key
4. Revoke the old key
5. Update team members

---

**Remember**: API keys are sensitive credentials. Treat them like passwords and keep them secure!
