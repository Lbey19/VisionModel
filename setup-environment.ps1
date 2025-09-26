# Script pour configurer l'environnement Ollama
# Ce script ajoute Ollama au PATH pour la session PowerShell courante

Write-Host "Configuration de l'environnement Ollama..." -ForegroundColor Green

# Ajouter Ollama au PATH si pas déjà présent
$ollamaPath = "C:\Users\$env:USERNAME\AppData\Local\Programs\Ollama"
if ($env:PATH -notlike "*$ollamaPath*") {
    $env:PATH += ";$ollamaPath"
    Write-Host "✅ Ollama ajouté au PATH" -ForegroundColor Green
} else {
    Write-Host "✅ Ollama déjà dans le PATH" -ForegroundColor Yellow
}

# Vérifier que Ollama fonctionne
try {
    $version = ollama --version
    Write-Host "✅ Ollama version: $version" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: Impossible de démarrer Ollama" -ForegroundColor Red
    exit 1
}

# Lister les modèles disponibles
Write-Host "`nModèles Ollama disponibles:" -ForegroundColor Cyan
ollama list

Write-Host "`n🚀 Environnement prêt ! Vous pouvez maintenant utiliser ollama dans ce terminal." -ForegroundColor Green
