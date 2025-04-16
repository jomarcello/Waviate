# Use Node.js 18 as the base image
FROM node:18-slim

# Set working directory 
WORKDIR /app

# Copy package.json files
COPY package.json ./
COPY backend/package.json ./backend/

# Install dependencies
RUN npm install
RUN cd backend && npm install

# Copy the rest of the application code
COPY . .

# Set environment variables for Railway
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["node", "backend/server/server.js"] 