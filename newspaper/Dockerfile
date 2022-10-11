# base node image
FROM node:16-bullseye as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp/packages/letterpress
ADD ./packages/letterpress/package.json ./
WORKDIR /myapp
ADD ./package.json ./package-lock.json ./.npmrc ./
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

COPY --from=deps /myapp/node_modules /myapp/node_modules

WORKDIR /myapp/packages/letterpress
ADD ./packages/letterpress/package.json ./
WORKDIR /myapp
RUN ls -lash /myapp/node_modules/letterpress && sleep 5

ADD package.json .npmrc ./
RUN npm prune --production

# Build the app
FROM base as build

WORKDIR /myapp
ADD . .

COPY --from=deps /myapp/node_modules /myapp/node_modules

RUN cd /myapp/node_modules/@parcel/watcher && npm run install
WORKDIR /myapp/packages/letterpress
RUN npm run build
RUN ls -lash /myapp/packages/letterpress/dist && sleep 5

WORKDIR /myapp
ADD prisma .
RUN npx prisma generate

RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/packages/letterpress/dist /myapp/packages/letterpress/dist
ADD . .

CMD ["npm", "start"]