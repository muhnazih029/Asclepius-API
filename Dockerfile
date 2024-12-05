FROM node:18

WORKDIR /usr/src/app

# ENV HOST 0.0.0.0

COPY package*.json ./

RUN npm install --only=prod

COPY . .

EXPOSE 3000

CMD ["npm", "start"]