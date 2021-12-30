# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
RUN npm install react-scripts@4.0.3 -g --silent
RUN npm install react-scripts@4.0.3 prettier@2.3.0 eslint@7.27.0 -g --silent

# add app
COPY . ./

# start app
CMD ["npm", "start"]
