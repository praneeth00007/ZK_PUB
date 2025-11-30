## ZK Age Proof Flow (Groth16)

Artifacts expected in `public/zk/age18`:

- `age18.wasm`
- `age18_final.zkey`
- `verification_key.json`

Frontend utilities:

- `src/zk/circuits/proofGenerator.js` provides `generateAgeProof` and `verifyAgeProof` using snarkjs
- `src/components/ProofGenerator.jsx` simple UI to create and view proof

Generate Solidity verifier from zkey (overwrites `contracts/Verifier.sol`):

```bash
npm run zk:export:verifier
```

Example Circom circuit idea (not included here): prove `(currentYear - birthYear) >= threshold` without revealing birthYear.

Place compiled artifacts under `public/zk/age18/` so Vite can serve them at `/zk/age18/...`.
