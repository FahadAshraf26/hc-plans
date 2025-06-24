FROM node:16-alpine

RUN apk --no-cache add build-base python git make g++
RUN apk --no-cache add openssl dumb-init
RUN npm i npm@latest -g

# Add support for https on wget
RUN apk update && apk add --no-cache wget && apk --no-cache add openssl wget && apk add ca-certificates && update-ca-certificates

WORKDIR /build

COPY package*.json ./

RUN npm install
RUN npm rebuild phantomjs-prebuilt

COPY ops/docker/api-server/dev/entrypoint.sh /
RUN chmod +x /entrypoint.sh
WORKDIR /honeycomb-api

ENTRYPOINT ["/entrypoint.sh"]
