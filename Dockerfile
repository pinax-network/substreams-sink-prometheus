FROM node:current

WORKDIR /app
COPY . .

RUN npm ci
RUN npm run build

ENTRYPOINT ["node", "dist/bin/cli.js"]