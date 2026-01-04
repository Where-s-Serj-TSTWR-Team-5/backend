FROM node:20

WORKDIR /app/database

# Only copy package files first (cache optimization)
COPY package*.json ./

RUN npm install 
# RUN npx prisma generate 