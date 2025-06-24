#!/bin/sh
echo "Starting CI container"
sleep 15
/usr/bin/dumb-init -- node ./bin/www.js start