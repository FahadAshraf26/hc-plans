FROM node:16-buster
RUN apt-get update && apt-get install -y software-properties-common curl build-essential supervisor wget libstdc++6
WORKDIR /build_modules
COPY package*.json ./
RUN npm install --production
WORKDIR /honeycomb-api
RUN mkdir ./static
RUN cp -r /build_modules/node_modules /honeycomb-api
COPY . .
RUN npm run tsc
CMD ["npm","start"]
#CMD ["tail","-f","/dev/null"]
