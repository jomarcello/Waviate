# Use Node.js 18 as the base image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy only the package files first for better caching
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY backend/ ./

# Expose the port the app runs on
EXPOSE 3000

# Add debugging information
RUN ls -la
RUN echo "Current directory structure:"
RUN find . -type f | sort

# Start the application
CMD ["node", "server/server.js"] 