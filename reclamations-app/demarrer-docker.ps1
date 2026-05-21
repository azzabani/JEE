# Script pour demarrer l'application avec Docker

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Demarrage de l'Application avec Docker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verifier que Docker est demarre
Write-Host "[1/4] Verification de Docker..." -ForegroundColor Yellow
docker ps > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERREUR] Docker n'est pas demarre!" -ForegroundColor Red
    Write-Host "Demarrez Docker Desktop et reessayez" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] Docker est pret" -ForegroundColor Green
Write-Host ""

# Arreter les conteneurs existants
Write-Host "[2/4] Arret des conteneurs existants..." -ForegroundColor Yellow
docker-compose down 2>$null
Write-Host "[OK]" -ForegroundColor Green
Write-Host ""

# Construire et demarrer
Write-Host "[3/4] Construction des images Docker..." -ForegroundColor Yellow
Write-Host "Cela peut prendre 5-10 minutes la premiere fois..." -ForegroundColor Gray
Write-Host ""

docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[4/4] Verification des conteneurs..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    docker-compose ps
    Write-Host ""
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "[OK] APPLICATION DEMARREE!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Acces a l'application:" -ForegroundColor Yellow
    Write-Host "  Frontend: http://localhost" -ForegroundColor Cyan
    Write-Host "  Backend:  http://localhost:8080" -ForegroundColor Cyan
    Write-Host "  Swagger:  http://localhost:8080/swagger-ui.html" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Identifiants:" -ForegroundColor Yellow
    Write-Host "  Username: admin" -ForegroundColor White
    Write-Host "  Password: admin123" -ForegroundColor White
    Write-Host ""
    Write-Host "Pour voir les logs:" -ForegroundColor Yellow
    Write-Host "  docker-compose logs -f" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Pour arreter:" -ForegroundColor Yellow
    Write-Host "  docker-compose down" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "[ERREUR] Le demarrage a echoue" -ForegroundColor Red
    Write-Host "Consultez les logs avec: docker-compose logs" -ForegroundColor Yellow
}

Write-Host "========================================" -ForegroundColor Cyan
