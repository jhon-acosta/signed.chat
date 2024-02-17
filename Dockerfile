FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

ARG NEXT_PUBLIC_MONGO_URI

ENV NEXT_PUBLIC_MONGO_URI=${NEXT_PUBLIC_MONGO_URI}

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]