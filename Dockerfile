# Use a lighter version of Node as a parent image
FROM node:16.8.0

# Create App Directory
RUN mkdir -p /usr/src/api

# Set the working directory to /api
WORKDIR /usr/src/api

# copy package.json into the container at /api
COPY package*.json ./

# install dependencies
RUN npm config set registry http://registry.npmjs.org/
RUN npm install

# Copy the current directory contents into the container at /api
COPY . .

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the app when the container launches
CMD ["npm", "run", "start"]