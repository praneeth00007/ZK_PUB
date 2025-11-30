pragma circom 2.0.0;

// Age verification circuit that works with extracted text from ID documents
template AgeVerification() {
    // Private inputs (user's sensitive data)
    signal private input birthYear;
    signal private input salt; // Random salt for privacy
    
    // Public inputs (what gets revealed)
    signal input minAge; // Minimum age required (e.g., 18)
    signal input currentYear; // Current year
    signal input publicHash; // Hash of user identifier (e.g., wallet address)
    
    // Outputs
    signal output isValid;
    signal output commitment; // Hash commitment for verification
    
    // Components
    component geq = GreaterEqThan(16); // 16 bits for year comparison
    component hash = Poseidon(4);
    
    // Calculate age
    signal calculatedAge;
    calculatedAge <== currentYear - birthYear;
    
    // Verify age >= minimum age
    geq.in[0] <== calculatedAge;
    geq.in[1] <== minAge;
    
    // Generate commitment hash (age + birthYear + salt + publicHash)
    hash.inputs[0] <== calculatedAge;
    hash.inputs[1] <== birthYear;
    hash.inputs[2] <== salt;
    hash.inputs[3] <== publicHash;
    
    // Set outputs
    isValid <== geq.out;
    commitment <== hash.out;
}

// Helper template for greater than or equal comparison
template GreaterEqThan(n) {
    assert(n <= 252);
    signal input in[2];
    signal output out;
    
    component lt = LessThan(n+1);
    
    lt.in[0] <== in[1];
    lt.in[1] <== in[0] + 1;
    out <== lt.out;
}

// Helper template for less than comparison
template LessThan(n) {
    assert(n <= 252);
    signal input in[2];
    signal output out;

    component n2b = Num2Bits(n);

    n2b.in <== in[0] + (1<<n) - in[1];

    out <== 1 - n2b.out[n];
}

// Helper template for number to bits conversion
template Num2Bits(n) {
    signal input in;
    signal output out[n];
    var lc1=0;

    var e2=1;
    for (var i = 0; i<n; i++) {
        out[i] <-- (in >> i) & 1;
        out[i] * (out[i] -1 ) === 0;
        lc1 += out[i] * e2;
        e2 = e2+e2;
    }

    lc1 === in;
}

// Simplified Poseidon hash function
template Poseidon(nInputs) {
    signal input inputs[nInputs];
    signal output out;
    
    // This is a simplified version - in production, use the full Poseidon implementation
    component hash = PoseidonHashT(nInputs);
    
    for (var i = 0; i < nInputs; i++) {
        hash.inputs[i] <== inputs[i];
    }
    
    out <== hash.out;
}

// Placeholder for actual Poseidon implementation
template PoseidonHashT(nInputs) {
    signal input inputs[nInputs];
    signal output out;
    
    // In actual implementation, this would be the full Poseidon hash
    // For now, using a simple sum (NOT secure - use actual Poseidon in production)
    var sum = 0;
    for (var i = 0; i < nInputs; i++) {
        sum += inputs[i];
    }
    out <== sum;
}

component main = AgeVerification();
