FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm ci --force

COPY . .

RUN npm rebuild bcrypt
RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV DOCKER=true

EXPOSE 3001

CMD ["node", "dist/server.js"]
