# PowerShell script to run the server with GitHub token
# Set your GitHub token here (replace YOUR_TOKEN_HERE with your actual token)
$env:GITHUB_TOKEN = "YOUR_TOKEN_HERE"

# Check if token is set
if ($env:GITHUB_TOKEN -eq "YOUR_TOKEN_HERE") {
    Write-Host "Please edit this file and replace YOUR_TOKEN_HERE with your actual GitHub token" -ForegroundColor Red
    Write-Host "Create a token at: https://github.com/settings/tokens" -ForegroundColor Yellow
    Write-Host "Required scopes: repo or public_repo" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Starting server with GitHub token..." -ForegroundColor Green
python -m http.server 8000