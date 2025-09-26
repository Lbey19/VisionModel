@echo off
echo Demarrage Vision API...
set PORT=3001
set LLM_MODEL=gemma2:2b
node server.js
pause