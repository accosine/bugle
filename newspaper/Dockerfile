# base node image
FROM node:16-bullseye as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as letterpress

WORKDIR /myapp/packages/letterpress
ADD ./letterpress/package.json ./letterpress/package-lock.json ./
RUN npm install --production=false
ADD ./letterpress ./

# RUN cd /myapp/packages/letterpress/node_modules/@parcel/watcher && npm run install
RUN npm run build
RUN npm run cleanup

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp/packages/prismatic
ADD ./newsroom/packages/prismatic ./

WORKDIR /myapp/packages/letterpress
COPY --from=letterpress /myapp/packages/letterpress/package.json /myapp/packages/letterpress
COPY --from=letterpress /myapp/packages/letterpress/dist /myapp/packages/letterpress/
WORKDIR /myapp
ADD ./newspaper/package.json ./newspaper/package-lock.json ./
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

COPY --from=deps /myapp/packages /myapp/packages
COPY --from=deps /myapp/node_modules /myapp/node_modules

WORKDIR /myapp/packages/prismatic
ADD ./newsroom/packages/prismatic/package.json ./
WORKDIR /myapp

ADD ./newspaper/package.json ./newsroom/.npmrc ./
RUN npm prune --production --ignore-scripts

# Build the app
FROM base as build

WORKDIR /myapp
ADD ./newspaper .

COPY --from=deps /myapp/node_modules /myapp/node_modules
COPY --from=deps /myapp/packages/prismatic/node_modules /myapp/packages/prismatic/node_modules

WORKDIR /myapp

RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /myapp

ADD ./newspaper ./
COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=production-deps /myapp/packages/prismatic/node_modules /myapp/packages/prismatic/node_modules

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/packages/letterpress/dist /myapp/packages/letterpress/dist

CMD ["npm", "start"]