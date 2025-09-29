# This Dockerfile is copy-pasted from: https://turborepo.com/docs/guides/tools/docker
FROM node:22-alpine

WORKDIR /usr/src/app

# Copy root package files for workspace setup
COPY package.json ./
COPY package-lock.json ./

# Copy packages directory
COPY packages/ ./packages/

RUN npm install
 
# Copy app source
COPY . .
 
EXPOSE 5001
 
CMD [ "node", "apps/api/server.js" ]