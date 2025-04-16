# Use Node.js 18 as the base image
FROM node:18-slim

# Set working directory 
WORKDIR /app

# Copy files
COPY package*.json ./
COPY simple-server.js ./

# Install dependencies
RUN npm init -y && \
    npm install express body-parser

# Add debugging information
RUN echo "===== DIRECTORY STRUCTURE ====="
RUN ls -la
RUN echo "===== NODE VERSION ====="
RUN node --version
RUN echo "===== NPM VERSION ====="
RUN npm --version

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["node", "simple-server.js"] 