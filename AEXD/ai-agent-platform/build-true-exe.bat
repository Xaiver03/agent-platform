@echo off
echo Building AI Agent Platform EXE...

echo Installing pkg...
npm install --no-save pkg

echo Building standalone exe...
npx pkg standalone-server.js --targets node18-win-x64 --output dist-exe/AI-Agent-体验台.exe

echo.
echo ✅ Build complete!
echo 📁 Output: dist-exe/AI-Agent-体验台.exe
echo 🎯 Usage: Double-click to run, no dependencies needed!
pause
