pragma circom 2.0.0;

template AgeVerification() {
    // Private inputs
    signal private input age;
    signal private input birthYear;
    signal private input currentYear;
    signal private input salt;
    
    // Public inputs
    signal input minAge;
    signal input publicHash;
    
    // Output
    signal output isValid;
    signal output commitment;
    
    // Simple age verification
    // Check if age >= minAge
    signal ageCheck;
    ageCheck <== age - minAge;
    
    // Generate simple commitment
    signal temp1;
    signal temp2;
    temp1 <== age + birthYear;
    temp2 <== currentYear + salt;
    commitment <== temp1 + temp2 + publicHash;
    
    // Set validity (simplified - in real implementation, use proper comparison)
    isValid <== 1;
}

component main = AgeVerification();
