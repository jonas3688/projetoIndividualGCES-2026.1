FROM node:20-alpine

# Set working directory for the application
WORKDIR /usr/src/app

# Copy all project files (including game and server directories)
COPY . .

# Change to the server directory where package.json and server.js reside
WORKDIR /usr/src/app/server

# Install dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 55555

# Run the dev script (starts nodemon for hot-reload)
CMD ["npm", "run", "dev"]
