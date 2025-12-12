FROM node:20

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --force

# Copy the entire application
COPY . .

# Rebuild native modules for the current platform
RUN npm rebuild bcrypt

# Generate Prisma client with the correct binary targets
RUN npx prisma generate

# Build the application
RUN npm run build

# Set environment variables
ENV NODE_ENV=production
ENV DOCKER=true

# Expose the port
EXPOSE 3001

# Start the server
CMD ["node", "dist/server.js"]
