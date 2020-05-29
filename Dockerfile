FROM node:12-alpine

ENV NODE_ENV production

WORKDIR /srv

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .

EXPOSE 3001

CMD npm start
