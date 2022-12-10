# base node image
FROM node:16-bullseye as bootstrap

# Install all node_modules, including dev dependencies

WORKDIR /myapp/bootstrap
ADD ./bootstrap/package.json ./bootstrap/package-lock.json ./bootstrap/bootstrap.js ./
RUN npm install --production=false

CMD ["npm", "start"]