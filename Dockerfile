# Use Node.js 18 as the base image
FROM node:18-slim

# Set working directory 
WORKDIR /app

# Copy essential files
COPY package.json ./
COPY simple-server.js ./
COPY start.sh ./

# Install dependencies and make script executable
RUN npm install && \
    chmod +x /app/start.sh

# Show what's in the directory for debugging
RUN ls -la

# Expose the port the app runs on
EXPOSE 3000

# Start the server directly
CMD ["node", "simple-server.js"] 