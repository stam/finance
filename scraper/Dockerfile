FROM node:12

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn --non-interactive --production

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
