# Use Node.js 18 as the base image
FROM node:18-slim

# Set working directory 
WORKDIR /app

# Copy essential files
COPY package.json ./
COPY simple-server.js ./

# Install dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "run", "railway"] 