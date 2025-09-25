@echo off
echo Demarrage Vision API...
set PORT=3001
set LLM_MODEL=gemma3:1b
node server.js
pause