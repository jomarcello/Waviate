# Use Node.js 18 as the base image
FROM node:18-slim

# Set working directory 
WORKDIR /app

# Copy the standalone server and package.json
COPY standalone-server.js /app/
COPY backend/package.json /app/

# Install only production dependencies
RUN npm install --only=production express cors dotenv

# Add debugging information
RUN echo "===== DIRECTORY STRUCTURE ====="
RUN ls -la
RUN echo "===== NODE VERSION ====="
RUN node --version
RUN echo "===== NPM VERSION ====="
RUN npm --version

# Expose the port the app runs on
EXPOSE 3000

# Start the standalone server
CMD ["node", "standalone-server.js"] 