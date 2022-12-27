# base node image
FROM node:16-bullseye as bootstrap

# Install all node_modules, including dev dependencies

WORKDIR /myapp/prismatic
ADD ./packages/prismatic/ ./
RUN npm install --production=false

CMD ["npm", "run", "prisma:reset"]