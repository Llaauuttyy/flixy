FROM node:20.18.0

WORKDIR /front

COPY frontend/app-front/package*.json ./

RUN npm install

COPY frontend/app-front/ .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]