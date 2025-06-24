FROM node:16-alpine

RUN apk --no-cache add build-base python git make g++
RUN apk --no-cache add openssl dumb-init
RUN npm i npm@latest -g

WORKDIR /honeycomb-api

COPY package*.json ./
COPY . .
RUN npm install

COPY ops/docker/api-server/dev/entrypoint.sh /
RUN chmod +x /entrypoint.sh


ENTRYPOINT ["/entrypoint.sh"]
