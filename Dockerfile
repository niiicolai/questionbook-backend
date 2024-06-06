FROM node:22-alpine3.19

WORKDIR /app

COPY package*.json ./
COPY .env ./

RUN apk add --no-cache g++ make cmake

RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "index.js"]