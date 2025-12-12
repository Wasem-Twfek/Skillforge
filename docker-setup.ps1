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
docker-compose build

# Step 3: Start containers
Write-Host "`nStep 3: Starting containers with docker-compose..." -ForegroundColor Cyan
docker-compose up -d

# Step 4: Run database migrations
Write-Host "`nStep 4: Running database migrations..." -ForegroundColor Cyan
Write-Host "Waiting for database to be ready..."
Start-Sleep -Seconds 10
docker-compose exec backend npx prisma migrate dev --name init

Write-Host "`nDocker setup completed!" -ForegroundColor Green
Write-Host "Your SkillForge application should now be running at http://localhost"
Write-Host "Backend API is available at http://localhost/api"
Write-Host "`nTo view logs: docker-compose logs -f"
Write-Host "To stop containers: docker-compose down"
