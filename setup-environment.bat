@echo off
echo Configuration de l'environnement Ollama...

REM Ajouter Ollama au PATH
set "OLLAMA_PATH=C:\Users\%USERNAME%\AppData\Local\Programs\Ollama"
set "PATH=%PATH%;%OLLAMA_PATH%"

REM Tester Ollama
ollama --version
if %ERRORLEVEL% EQU 0 (
    echo ✅ Ollama configuré avec succès
    echo.
    echo Modèles disponibles:
    ollama list
) else (
    echo ❌ Erreur de configuration Ollama
    pause
    exit /b 1
)

echo.
echo 🚀 Environnement prêt ! Utilisez 'ollama' dans ce terminal.
pause
