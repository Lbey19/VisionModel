@echo off
echo ================================================
echo     Creation du package VisionModel
echo ================================================
echo.

:: Créer le dossier de distribution
if exist "VisionModel-Package" rmdir /s /q "VisionModel-Package"
mkdir "VisionModel-Package"

:: Copier les fichiers essentiels
echo Copie des fichiers...
copy "server.js" "VisionModel-Package\"
copy "package.json" "VisionModel-Package\"
copy "start-server.bat" "VisionModel-Package\"
copy "install-new-pc.bat" "VisionModel-Package\"
copy "rag.js" "VisionModel-Package\"
copy "rag.index.json" "VisionModel-Package\"
copy "DEPLOYMENT.md" "VisionModel-Package\"
copy ".gitignore" "VisionModel-Package\"

:: Copier les dossiers
echo Copie des dossiers...
xcopy "public" "VisionModel-Package\public\" /e /i /q
xcopy "docs" "VisionModel-Package\docs\" /e /i /q

:: Créer le README pour le nouveau PC
echo # VisionModel - Installation rapide > "VisionModel-Package\README.txt"
echo. >> "VisionModel-Package\README.txt"
echo 1. Decompresser ce dossier >> "VisionModel-Package\README.txt"
echo 2. Double-cliquer sur install-new-pc.bat >> "VisionModel-Package\README.txt"  
echo 3. Suivre les instructions >> "VisionModel-Package\README.txt"
echo 4. Acceder a http://localhost:3001 >> "VisionModel-Package\README.txt"
echo. >> "VisionModel-Package\README.txt"
echo Prerequis: >> "VisionModel-Package\README.txt"
echo - Node.js (https://nodejs.org) >> "VisionModel-Package\README.txt"
echo - Ollama (https://ollama.ai/download) >> "VisionModel-Package\README.txt"

:: Créer l'archive (si PowerShell disponible)
echo Creation de l'archive...
powershell -command "Compress-Archive -Path 'VisionModel-Package\*' -DestinationPath 'VisionModel-Portable.zip' -Force"

if exist "VisionModel-Portable.zip" (
    echo ✅ Package cree: VisionModel-Portable.zip
    echo.
    echo Vous pouvez maintenant transferer ce fichier zip
    echo sur le nouveau PC et suivre les instructions.
) else (
    echo ❌ Erreur creation archive
    echo Le dossier VisionModel-Package contient tous les fichiers
)

echo.
echo Contenu du package:
dir "VisionModel-Package" /b

pause