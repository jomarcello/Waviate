# Use Node.js 18 as the base image
FROM node:18-slim

# Set working directory 
WORKDIR /app

# Copy files
COPY package.json package*.json ./
COPY simple-server.js ./

# Install dependencies
RUN npm install

# Display directory contents for debugging
RUN ls -la

# Expose the port the app runs on
EXPOSE 3000

# Use exact CMD format that matches Railway interface setting
CMD ["node", "simple-server.js"] 