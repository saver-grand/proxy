# Use official Node LTS
FROM node:20-alpine

WORKDIR /app

# copy package first for docker layer caching
COPY package.json package-lock.json* ./
RUN npm ci --production

COPY . .

EXPOSE 10000
ENV PORT=10000

CMD ["node", "server.js"]
