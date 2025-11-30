@echo off
echo 🚀 Installing ZK-Pub Age Verification System...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js version detected
node --version

REM Install npm dependencies
echo 📦 Installing npm dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install npm dependencies
    pause
    exit /b 1
)

REM Check if circom is installed globally
circom --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔧 Installing circom globally...
    npm install -g circom
    if %errorlevel% neq 0 (
        echo ❌ Failed to install circom
        pause
        exit /b 1
    )
) else (
    echo ✅ circom is already installed
)

REM Check if snarkjs is installed globally
snarkjs --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔧 Installing snarkjs globally...
    npm install -g snarkjs
    if %errorlevel% neq 0 (
        echo ❌ Failed to install snarkjs
        pause
        exit /b 1
    )
) else (
    echo ✅ snarkjs is already installed
)

REM Setup API keys configuration
echo 🔑 Setting up API keys configuration...
npm run zk:setup-keys

REM Run setup tests
echo 🧪 Running setup tests...
npm run zk:test
if %errorlevel% neq 0 (
    echo ❌ Setup tests failed. Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo 🎉 Installation completed successfully!
echo.
echo 📋 Next steps:
echo 1. Set up your environment variables (see ZK_SETUP.md)
echo 2. Get an API Ninjas key for image-to-text extraction
echo 3. Configure your blockchain network settings
echo 4. Run 'npm run zk:compile' to compile the ZK circuit
echo 5. Run 'npm run dev' to start the development server
echo.
echo 🔗 Useful links:
echo - API Ninjas: https://api-ninjas.com/
echo - MetaMask: https://metamask.io/
echo - Documentation: ZK_SETUP.md
echo.
pause
