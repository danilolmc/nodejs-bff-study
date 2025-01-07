FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build 

FROM node:20-alpine AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app /usr/src/app

RUN npm ci --only=production

EXPOSE 3000

CMD ["node", "dist/index.js"]
