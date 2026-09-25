FROM node:20 AS builder

WORKDIR /app

# Copy icon generator first (the build's PWA icon step needs ../scripts/)
COPY scripts/ /app/scripts/

# Copy frontend package files and install dependencies (includes sharp for
# the real PWA icon generator and typescript for the real typecheck)
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --force

# Copy frontend source code (public/ included: vite copies it to dist)
COPY frontend/ ./

# Relative (origin-only) API base. Service paths already carry the /api prefix
# (see frontend/src/lib/axios.ts), so baking /api here would produce
# /api/api/* in production. Empty keeps requests relative for nginx to proxy.
RUN echo "VITE_API_URL=" > .env

# Real production build: PWA icons + tsc -b + vite build.
# No placeholder assets, no build-step stripping: a type error fails the image.
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine AS production

# Copy built files to Nginx serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
