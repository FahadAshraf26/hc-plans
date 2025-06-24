#!/bin/sh
echo "Starting dev container"
mv /build/node_modules /honeycomb-api
sleep 15;
#/usr/bin/dumb-init -- node nodemon ./bin/www.ts start
npx nodemon ./bin/www.js start