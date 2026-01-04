FROM node:20

WORKDIR /app/services/events

# Only copy package files first (cache optimization)
COPY package*.json ./

RUN npm install
RUN npm run dev