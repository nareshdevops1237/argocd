FROM node:20-alpine
WORKDIR /applications
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY server.js .
EXPOSE 3000
CMD ["node", "server.js"]

