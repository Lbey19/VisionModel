@echo off
echo ================================================
echo    Installation VisionModel - Nouveau PC
echo ================================================
echo.

:: Vérifier si Node.js est installé
echo [1/5] Verification Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js non trouve!
    echo Telechargez Node.js depuis: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js detecte
)

:: Vérifier si Ollama est installé
echo.
echo [2/5] Verification Ollama...
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ollama non trouve!
    echo Telechargez Ollama depuis: https://ollama.ai/download
    pause
    exit /b 1
) else (
    echo ✅ Ollama detecte
)

:: Installer les dépendances npm
echo.
echo [3/5] Installation des dependances...
npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur installation npm
    pause
    exit /b 1
) else (
    echo ✅ Dependencies installees
)

:: Télécharger les modèles Ollama
echo.
echo [4/5] Telechargement des modeles IA...
echo Telechargement gemma3:1b (rapide)...
ollama pull gemma3:1b
echo Telechargement llama3.1:8b (complet)...
ollama pull llama3.1:8b
echo Telechargement nomic-embed-text (embeddings)...
ollama pull nomic-embed-text
echo ✅ Modeles installes

:: Test de l'installation
echo.
echo [5/5] Test de l'installation...
echo Demarrage du serveur de test...
timeout /t 3 /nobreak >nul
start /b .\start-server.bat
timeout /t 5 /nobreak >nul

:: Tester la connexion
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Serveur non accessible
    echo Verifiez manuellement avec: .\start-server.bat
) else (
    echo ✅ Serveur operationnel!
    echo.
    echo ================================================
    echo     Installation terminee avec succes!
    echo ================================================
    echo.
    echo 🌐 Interface web: http://localhost:3001
    echo 📊 Status API: http://localhost:3001/health  
    echo 🚀 Demarrage: .\start-server.bat
    echo.
    echo Appuyez sur une touche pour ouvrir l'interface...
    pause >nul
    start http://localhost:3001
)

pause