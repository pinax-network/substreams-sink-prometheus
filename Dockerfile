FROM node:current

WORKDIR /app
COPY . .

RUN npm ci

CMD ["npm", "start"]