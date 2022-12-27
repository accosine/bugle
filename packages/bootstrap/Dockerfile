# base node image
FROM node:16-bullseye as bootstrap

# Install all node_modules, including dev dependencies

WORKDIR /myapp/bootstrap
ADD ./packages/bootstrap/package.json ./packages/bootstrap/bootstrap.js ./
RUN npm install --production=false

CMD ["npm", "start"]