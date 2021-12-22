# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@4.0.3 prettier@2.3.0 eslint@7.27.0 -g --silent
RUN npm install react-router-dom --save
RUN npm install three @react-three/fiber --save
RUN npm install three @react-three/postprocessing --save
RUN npm i --save react-select

# add app
COPY . ./

# start app
CMD ["npm", "start"]
