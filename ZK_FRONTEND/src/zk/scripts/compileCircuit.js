import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CIRCUIT_NAME = 'simple_age';
const CIRCUIT_DIR = path.join(__dirname, '../../zkk');
const OUTPUT_DIR = path.join(__dirname, '../../../public/zk/age18');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('🔧 Compiling ZK Age Verification Circuit...');
console.log(`Circuit: ${CIRCUIT_NAME}`);
console.log(`Input: ${CIRCUIT_DIR}`);
console.log(`Output: ${OUTPUT_DIR}`);

try {
  // Step 1: Compile the circuit
  console.log('\n📝 Step 1: Compiling circuit...');
  const compileCommand = `circom ${path.join(CIRCUIT_DIR, `${CIRCUIT_NAME}.circom`)} --r1cs --wasm --sym --c -o ${OUTPUT_DIR}`;
  execSync(compileCommand, { stdio: 'inherit' });
  
  // Step 2: Generate setup (trusted setup ceremony)
  console.log('\n🔐 Step 2: Generating trusted setup...');
  const setupCommand = `snarkjs powersoftau new bn128 12 ${path.join(OUTPUT_DIR, 'pot12_0000.ptau')} -v`;
  execSync(setupCommand, { stdio: 'inherit' });
  
  // Step 3: Contribute to ceremony (simplified for demo)
  console.log('\n🎭 Step 3: Contributing to ceremony...');
  const contributeCommand = `snarkjs powersoftau contribute ${path.join(OUTPUT_DIR, 'pot12_0000.ptau')} ${path.join(OUTPUT_DIR, 'pot12_0001.ptau')} --name="First contribution" -v`;
  execSync(contributeCommand, { stdio: 'inherit' });
  
  // Step 4: Phase 2 setup
  console.log('\n⚡ Step 4: Phase 2 setup...');
  const phase2Command = `snarkjs powersoftau prepare phase2 ${path.join(OUTPUT_DIR, 'pot12_0001.ptau')} ${path.join(OUTPUT_DIR, 'pot12_final.ptau')} -v`;
  execSync(phase2Command, { stdio: 'inherit' });
  
  // Step 5: Generate proving key
  console.log('\n🔑 Step 5: Generating proving key...');
  const provingKeyCommand = `snarkjs groth16 setup ${path.join(OUTPUT_DIR, `${CIRCUIT_NAME}.r1cs`)} ${path.join(OUTPUT_DIR, 'pot12_final.ptau')} ${path.join(OUTPUT_DIR, `${CIRCUIT_NAME}_0000.zkey`)}`;
  execSync(provingKeyCommand, { stdio: 'inherit' });
  
  // Step 6: Contribute to proving key
  console.log('\n🎯 Step 6: Contributing to proving key...');
  const contributeProvingCommand = `snarkjs zkey contribute ${path.join(OUTPUT_DIR, `${CIRCUIT_NAME}_0000.zkey`)} ${path.join(OUTPUT_DIR, `${CIRCUIT_NAME}_0001.zkey`)} --name="1st Contributor Name" -v`;
  execSync(contributeProvingCommand, { stdio: 'inherit' });
  
  // Step 7: Export verification key
  console.log('\n📋 Step 7: Exporting verification key...');
  const exportVkeyCommand = `snarkjs zkey export verificationkey ${path.join(OUTPUT_DIR, `${CIRCUIT_NAME}_0001.zkey`)} ${path.join(OUTPUT_DIR, 'verification_key.json')}`;
  execSync(exportVkeyCommand, { stdio: 'inherit' });
  
  // Step 8: Generate final zkey
  console.log('\n🏁 Step 8: Generating final zkey...');
  const finalZkeyCommand = `snarkjs zkey beacon ${path.join(OUTPUT_DIR, `${CIRCUIT_NAME}_0001.zkey`)} ${path.join(OUTPUT_DIR, `${CIRCUIT_NAME}_final.zkey`)} 0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 -n="Final Beacon phase2"`;
  execSync(finalZkeyCommand, { stdio: 'inherit' });
  
  // Step 9: Export Solidity verifier
  console.log('\n📄 Step 9: Exporting Solidity verifier...');
  const exportVerifierCommand = `snarkjs zkey export solidityverifier ${path.join(OUTPUT_DIR, `${CIRCUIT_NAME}_final.zkey`)} ${path.join(__dirname, '../../../contracts/Verifier.sol')}`;
  execSync(exportVerifierCommand, { stdio: 'inherit' });
  
  console.log('\n✅ Circuit compilation completed successfully!');
  console.log('\n📁 Generated files:');
  console.log(`   - ${path.join(OUTPUT_DIR, `${CIRCUIT_NAME}.r1cs`)}`);
  console.log(`   - ${path.join(OUTPUT_DIR, `${CIRCUIT_NAME}.wasm`)}`);
  console.log(`   - ${path.join(OUTPUT_DIR, `${CIRCUIT_NAME}_final.zkey`)}`);
  console.log(`   - ${path.join(OUTPUT_DIR, 'verification_key.json')}`);
  console.log(`   - ${path.join(__dirname, '../../../contracts/Verifier.sol')}`);
  
} catch (error) {
  console.error('\n❌ Error during compilation:', error.message);
  process.exit(1);
}
