FROM node:20 AS builder

WORKDIR /app

COPY scripts/ /app/scripts/

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --force

COPY frontend/ ./
RUN echo "VITE_API_URL=" > .env
RUN npm run build

FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
