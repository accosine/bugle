# base node image
# FROM node:16-bullseye-slim as base
FROM node:16-bullseye as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules for letterpress workspace and build package
# WORKDIR /opt/packages/letterpress
# ADD ./packages/letterpress/ ./
# RUN npm install --production=false --ignore-scripts

WORKDIR /opt/myapp/packages/letterpress
ADD ./packages/letterpress/package.json ./
WORKDIR /opt/myapp
ADD ./package.json ./package-lock.json ./.npmrc ./
RUN npm install --production=false

# TODO: Build parcel watcher until this is fixed: https://github.com/parcel-bundler/watcher/issues/101 
RUN cd /opt/myapp/node_modules/@parcel/watcher && npm run install
WORKDIR /opt/myapp/packages/letterpress
ADD ./packages/letterpress .
RUN npm run parcel:build
RUN ls -lash /opt/myapp/packages/letterpress/dist && sleep 5

# Install all node_modules, including dev dependencies

WORKDIR /opt/myapp
ADD . .
RUN npx prisma generate

RUN npm run build

RUN npm prune --production

CMD ["npm", "start"]
