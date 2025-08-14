@echo off
REM Set your GitHub token here (replace YOUR_TOKEN_HERE with your actual token)
set GITHUB_TOKEN=YOUR_TOKEN_HERE

REM Check if token is set
if "%GITHUB_TOKEN%"=="YOUR_TOKEN_HERE" (
    echo Please edit this file and replace YOUR_TOKEN_HERE with your actual GitHub token
    echo Create a token at: https://github.com/settings/tokens
    echo Required scopes: repo or public_repo
    pause
    exit /b 1
)

echo Starting server with GitHub token...
python -m http.server 8000