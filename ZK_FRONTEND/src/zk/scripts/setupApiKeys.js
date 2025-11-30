import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup script for API keys configuration
console.log('🔑 Setting up API Keys Configuration...\n');

const apiKeysPath = path.join(__dirname, '../../config/apiKeys.js');
const templatePath = path.join(__dirname, '../../config/apiKeys.template.js');

// Check if apiKeys.js already exists
if (fs.existsSync(apiKeysPath)) {
  console.log('✅ apiKeys.js already exists');
  console.log('📝 Current API keys configuration:');
  
  try {
    const content = fs.readFileSync(apiKeysPath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach(line => {
      if (line.includes('API_NINJAS:') || line.includes('OPENAI:') || line.includes('GOOGLE_VISION:')) {
        const keyName = line.split(':')[0].trim();
        const keyValue = line.split(':')[1].trim().replace(/'/g, '').replace(/,/g, '');
        
        if (keyValue && keyValue !== 'your_api_ninjas_key_here' && keyValue !== 'your_openai_key_here' && keyValue !== 'your_google_vision_key_here') {
          console.log(`   ${keyName}: ${keyValue.substring(0, 10)}...${keyValue.substring(keyValue.length - 4)}`);
        } else {
          console.log(`   ${keyName}: Not configured`);
        }
      }
    });
  } catch (error) {
    console.log('   Error reading configuration:', error.message);
  }
} else {
  console.log('📋 Creating apiKeys.js from template...');
  
  try {
    // Copy template to apiKeys.js
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    fs.writeFileSync(apiKeysPath, templateContent);
    
    console.log('✅ apiKeys.js created successfully');
    console.log('📝 Please edit src/config/apiKeys.js and add your actual API keys');
  } catch (error) {
    console.error('❌ Error creating apiKeys.js:', error.message);
    process.exit(1);
  }
}

console.log('\n🔗 API Keys you need to configure:');
console.log('1. API Ninjas (Required): https://api-ninjas.com/');
console.log('2. OpenAI (Optional): https://platform.openai.com/');
console.log('3. Google Vision (Optional): https://cloud.google.com/vision');
console.log('4. AWS Rekognition (Optional): https://aws.amazon.com/rekognition/');

console.log('\n📁 Configuration file location:');
console.log(`   ${apiKeysPath}`);

console.log('\n⚠️  Security reminder:');
console.log('   - Never commit apiKeys.js to version control');
console.log('   - Keep your API keys secure and private');
console.log('   - Use environment variables for production deployment');

console.log('\n✅ API keys setup complete!');
