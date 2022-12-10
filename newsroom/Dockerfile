# base node image
FROM node:16-bullseye as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp/packages/prismatic
ADD ./newsroom/packages/prismatic ./
WORKDIR /myapp
ADD ./newsroom/package.json ./newsroom/package-lock.json ./newsroom/.npmrc ./
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

COPY --from=deps /myapp/node_modules /myapp/node_modules
COPY --from=deps /myapp/packages/prismatic/node_modules /myapp/packages/prismatic/node_modules

WORKDIR /myapp/packages/prismatic
ADD ./newsroom/packages/prismatic/package.json ./
WORKDIR /myapp

ADD ./newsroom/package.json ./newsroom/.npmrc ./
RUN npm prune --production --ignore-scripts

# Build the app
FROM base as build

WORKDIR /myapp
ADD ./newsroom ./

COPY --from=deps /myapp/node_modules /myapp/node_modules
COPY --from=deps /myapp/packages/prismatic/node_modules /myapp/packages/prismatic/node_modules

WORKDIR /myapp

RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /myapp

ADD ./newsroom ./
COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=production-deps /myapp/packages/prismatic/node_modules /myapp/packages/prismatic/node_modules

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public

CMD ["npm", "start"]