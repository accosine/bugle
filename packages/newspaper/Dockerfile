
# base node image
# FROM node:16-bullseye-slim as base
FROM node:16-bullseye as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp

ADD package.json package-lock.json .npmrc ./
ADD ./packages/letterpress ./packages/letterpress
ADD ./packages/newspaper ./packages/newspaper
ADD ./packages/prismatic ./packages/prismatic
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json package-lock.json .npmrc ./
ADD ./packages/letterpress ./packages/letterpress
ADD ./packages/newspaper ./packages/newspaper
ADD ./packages/prismatic ./packages/prismatic
RUN npm prune --production

# Build the app
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD ./packages/letterpress ./packages/letterpress
ADD ./packages/newspaper ./packages/newspaper
ADD ./packages/prismatic ./packages/prismatic
ADD package.json ./
RUN npm run build:letterpress
RUN npm run prismatic:build
RUN npm run build:newspaper
RUN ls -lash ./packages/prismatic

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

ADD ./package.json ./
ADD ./packages/letterpress ./packages/letterpress
ADD ./packages/newspaper ./packages/newspaper
ADD ./packages/prismatic ./packages/prismatic
COPY --from=build /myapp/packages/letterpress/dist /myapp/packages/letterpress/dist
COPY --from=build /myapp/packages/prismatic/dist /myapp/packages/prismatic/dist
COPY --from=build /myapp/packages/newspaper/build /myapp/packages/newspaper/build
COPY --from=build /myapp/packages/newspaper/public /myapp/packages/newspaper/public

CMD ["npm", "run", "start:newspaper"]
