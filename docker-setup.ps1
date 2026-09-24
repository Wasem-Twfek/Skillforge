# Docker Setup Script for SkillForge
Write-Host "SkillForge Docker Setup Script" -ForegroundColor Green

# Step 1: Create environment files if they don't exist
Write-Host "`nStep 1: Setting up environment files..." -ForegroundColor Cyan
if (-not (Test-Path ".env")) {
    Write-Host "Creating root .env file from .env.example..."
    Copy-Item ".env.example" ".env"
} else {
    Write-Host "Root .env file already exists."
}

if (-not (Test-Path "skillforge-backend/.env")) {
    Write-Host "Creating backend .env file from .env.example..."
    Copy-Item "skillforge-backend/.env.example" "skillforge-backend/.env"
} else {
    Write-Host "Backend .env file already exists."
}

# Step 2: Build Docker images
Write-Host "`nStep 2: Building Docker images..." -ForegroundColor Cyan
Write-Host "This may take some time. Please be patient."
docker compose build

# Step 3: Start containers
Write-Host "`nStep 3: Starting containers with docker compose..." -ForegroundColor Cyan
docker compose up -d

# Step 4: Run database migrations (production workflow: deploy the committed
# migration history — never `migrate dev`, which would draft new migrations)
Write-Host "`nStep 4: Running database migrations..." -ForegroundColor Cyan
Write-Host "Waiting for database to be ready..."
$pgUser = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "postgres" }
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    docker compose exec -T postgres pg_isready -U $pgUser 2>$null
    if ($?) { $ready = $true; break }
    Start-Sleep -Seconds 2
}
if (-not $ready) { throw "PostgreSQL did not become ready in time." }
docker compose exec -T backend npx prisma migrate deploy

Write-Host "`nDocker setup completed!" -ForegroundColor Green
Write-Host "Your SkillForge application should now be running at http://localhost"
Write-Host "Backend API is available at http://localhost/api"
Write-Host "`nTo view logs: docker compose logs -f"
Write-Host "To stop containers: docker compose down"
