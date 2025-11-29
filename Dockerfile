FROM node:20-alpine

WORKDIR /app

# Install CA certificates
RUN apk add --no-cache ca-certificates

COPY package.json ./
RUN npm install --omit=dev
COPY . .

EXPOSE 10000
ENV PORT=10000

CMD ["node", "server.js"]
