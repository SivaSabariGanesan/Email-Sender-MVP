Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Email Sender - Initialization" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install Python dependencies" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}
Write-Host "✓ Python dependencies installed successfully" -ForegroundColor Green
Write-Host ""

Write-Host "Installing React dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install React dependencies" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}
Write-Host "✓ React dependencies installed successfully" -ForegroundColor Green
Set-Location ..
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor White
Write-Host "1. Run start_backend.bat (or cd backend && python app.py)" -ForegroundColor White
Write-Host "2. Run start_frontend.bat (or cd frontend && npm start)" -ForegroundColor White
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor White
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "- Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to continue"
