# Stop any running Node.js processes
Write-Host "Stopping any running Node.js processes..."
Get-Process | Where-Object { $_.ProcessName -like "*node*" } | Stop-Process -Force -ErrorAction SilentlyContinue

# Clean Prisma cache
Write-Host "Cleaning Prisma cache..."
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules\.prisma

# Reinstall dependencies
Write-Host "Reinstalling dependencies..."
npm install

# Generate Prisma client
Write-Host "Generating Prisma client..."
npx prisma generate

# Run migration
Write-Host "Running migration..."
npx prisma migrate dev --name add_auth_fields

Write-Host "Done!" 