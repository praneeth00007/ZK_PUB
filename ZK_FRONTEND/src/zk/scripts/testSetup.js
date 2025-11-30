import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test script to verify ZK setup
console.log('🧪 Testing ZK Age Verification Setup...\n');

const tests = [
  {
    name: 'Circuit file exists',
    test: () => {
      const circuitPath = path.join(__dirname, '../../zkk/age18.circom');
      return fs.existsSync(circuitPath);
    }
  },
  {
    name: 'Proof generator exists',
    test: () => {
      const generatorPath = path.join(__dirname, '../circuits/proofGenerator.js');
      return fs.existsSync(generatorPath);
    }
  },
  {
    name: 'Age verification component exists',
    test: () => {
      const componentPath = path.join(__dirname, '../../components/AgeVerification.jsx');
      return fs.existsSync(componentPath);
    }
  },
  {
    name: 'Register with ZK component exists',
    test: () => {
      const componentPath = path.join(__dirname, '../../components/RegisterWithZK.jsx');
      return fs.existsSync(componentPath);
    }
  },
  {
    name: 'Blockchain service exists',
    test: () => {
      const servicePath = path.join(__dirname, '../../services/blockchain.js');
      return fs.existsSync(servicePath);
    }
  },
  {
    name: 'Verifier contract exists',
    test: () => {
      const contractPath = path.join(__dirname, '../../../contracts/Verifier.sol');
      return fs.existsSync(contractPath);
    }
  },
  {
    name: 'Age verifier contract exists',
    test: () => {
      const contractPath = path.join(__dirname, '../../../contracts/AgeVerifier.sol');
      return fs.existsSync(contractPath);
    }
  },
  {
    name: 'ZK output directory exists',
    test: () => {
      const outputPath = path.join(__dirname, '../../../public/zk/age18');
      return fs.existsSync(outputPath);
    }
  }
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  try {
    const result = test.test();
    if (result) {
      console.log(`✅ ${test.name}`);
      passed++;
    } else {
      console.log(`❌ ${test.name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${test.name} - Error: ${error.message}`);
    failed++;
  }
});

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! ZK setup is complete.');
  console.log('\n📋 Next steps:');
  console.log('1. Install dependencies: npm install');
  console.log('2. Install circom globally: npm install -g circom snarkjs');
  console.log('3. Set up environment variables (see ZK_SETUP.md)');
  console.log('4. Compile circuit: npm run zk:compile');
  console.log('5. Start development server: npm run dev');
} else {
  console.log('\n⚠️  Some tests failed. Please check the setup.');
  process.exit(1);
}
