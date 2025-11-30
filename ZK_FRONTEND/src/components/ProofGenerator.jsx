import React, { useState } from 'react';
import { generateAgeProof, verifyAgeProof, formatProofForSolidity } from '../zk/circuits/proofGenerator';

export default function ProofGenerator() {
  const [birthYear, setBirthYear] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear().toString());
  const [threshold, setThreshold] = useState('18');
  const [status, setStatus] = useState('');
  const [proofOut, setProofOut] = useState(null);

  async function handleGenerate(e) {
    e.preventDefault();
    setStatus('Generating proof...');
    try {
      const input = {
        birthYear: Number(birthYear),
        threshold: Number(threshold),
        currentYear: Number(currentYear)
      };
      const { proof, publicSignals } = await generateAgeProof(input);
      const ok = await verifyAgeProof(proof, publicSignals);
      if (!ok) throw new Error('Local verification failed');
      const formatted = formatProofForSolidity(proof);
      setProofOut({ proof, publicSignals, formatted });
      setStatus('Proof generated and verified locally.');
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message || 'failed to generate proof'}`);
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: '24px auto' }}>
      <h2>Generate ZK Age Proof (≥ 18)</h2>
      <form onSubmit={handleGenerate} style={{ display: 'grid', gap: 12 }}>
        <label>
          Birth Year
          <input type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} required />
        </label>
        <label>
          Current Year
          <input type="number" value={currentYear} onChange={(e) => setCurrentYear(e.target.value)} required />
        </label>
        <label>
          Threshold
          <input type="number" value={threshold} onChange={(e) => setThreshold(e.target.value)} required />
        </label>
        <button type="submit">Generate Proof</button>
      </form>
      {status && <p>{status}</p>}
      {proofOut && (
        <div style={{ marginTop: 16 }}>
          <h3>Public Signals</h3>
          <pre>{JSON.stringify(proofOut.publicSignals, null, 2)}</pre>
          <h3>Proof (Solidity format)</h3>
          <pre>{JSON.stringify(proofOut.formatted, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}


