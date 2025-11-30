pragma circom 2.0.0;

template AgeVerification() {
    // Private inputs
    signal private input age;
    signal private input birthYear;
    signal private input currentYear;
    signal private input salt; // For privacy
    
    // Public inputs
    signal input minAge;
    signal input publicHash; // Hash of user identifier
    
    // Output
    signal output isValid;
    signal output commitment; // Hash commitment for verification
    
    // Components
    component geq = GreaterEqThan(8); // 8 bits should be enough for age comparison
    component hash = Poseidon(4);
    
    // Constraints
    // 1. Verify that calculated age matches input age
    signal calculatedAge;
    calculatedAge <== currentYear - birthYear;
    calculatedAge === age;
    
    // 2. Check if age >= minimum age
    geq.in[0] <== age;
    geq.in[1] <== minAge;
    
    // 3. Generate commitment hash
    hash.inputs[0] <== age;
    hash.inputs[1] <== birthYear;
    hash.inputs[2] <== salt;
    hash.inputs[3] <== publicHash;
    
    // 4. Set outputs
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
    lt.in[1] <== in[0]+1;
    out <== lt.out;
}

// Helper template for less than comparison
template LessThan(n) {
    assert(n <= 252);
    signal input in[2];
    signal output out;

    component n2b = Num2Bits(n);

    n2b.in <== in[0]+ (1<<n) - in[1];

    out <== 1-n2b.out[n];
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

// Poseidon hash function (simplified version)
template Poseidon(nInputs) {
    signal input inputs[nInputs];
    signal output out;
    
    // This is a simplified version - in production, use the full Poseidon implementation
    component hash = PoseidonHashT(nInputs + 1);
    
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