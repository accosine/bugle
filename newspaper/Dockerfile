# base node image
# FROM node:16-bullseye-slim as base
FROM node:16-bullseye as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules for letterpress workspace and build package
WORKDIR /opt/packages/letterpress
ADD ./packages/letterpress/ ./
RUN npm install --production=false --ignore-scripts
# TODO: Build parcel watcher until this is fixed: https://github.com/parcel-bundler/watcher/issues/101 
RUN cd /opt/packages/letterpress/node_modules/@parcel/watcher && npm run install
# WORKDIR /opt/packages/letterpress
RUN npm run parcel:build
RUN ls -lash /opt/packages/letterpress/dist && sleep 5

# Install all node_modules, including dev dependencies
WORKDIR /opt/myapp
ADD ./newspaper/package.json ./newspaper/package-lock.json ./newspaper/.npmrc ./
RUN npm install --production=false

ADD ./newspaper .
RUN npx prisma generate

RUN npm run build

WORKDIR /opt/packages/letterpress
RUN npm prune --production
WORKDIR /opt/myapp
RUN npm prune --production

CMD ["npm", "start"]
