FROM node:20-alpine

WORKDIR /app

# COPY ONLY package.json (no lock file required)
COPY package.json ./

# Install production dependencies
RUN npm install --omit=dev

COPY . .

EXPOSE 10000
ENV PORT=10000

CMD ["node", "server.js"]
