FROM node:20-alpine as build

WORKDIR /app

ARG NEXT_PUBLIC_API
ENV NEXT_PUBLIC_API=${NEXT_PUBLIC_API}

ARG NEXT_PUBLIC_SOCKET_URL
ENV NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL}

COPY package.json package-lock.json ./

RUN npm ci --only=production

COPY . .

RUN npm install --only=development

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/.next ./.next

RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]
