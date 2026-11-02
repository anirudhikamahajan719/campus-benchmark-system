@echo off
echo ================================================================
echo Starting Campus Competitive Learning & Skill Benchmarking System
echo ================================================================

start "Campus Benchmark - Backend" cmd /k "cd backend && npm start"
timeout /t 2 /nobreak >nul
start "Campus Benchmark - Frontend" cmd /k "cd frontend && npm run dev"

echo Both services launched!
echo Frontend will be running at: http://localhost:3000
echo Backend API & WebSockets at:  http://localhost:5000
echo ================================================================
