# Use Node.js 18 as the base image
FROM node:18-slim

# Set working directory 
WORKDIR /app

# Copy backend directory
COPY backend/ ./

# Install only production dependencies
RUN npm install --only=production

# Add debugging information
RUN echo "===== DIRECTORY STRUCTURE ====="
RUN ls -la
RUN echo "===== NODE VERSION ====="
RUN node --version
RUN echo "===== NPM VERSION ====="
RUN npm --version

# Expose the port the app runs on
EXPOSE 3000

# Create simple server file
RUN echo 'const express = require("express"); \
const app = express(); \
app.set("trust proxy", true); \
app.use(express.json()); \
app.get("/", (req, res) => { \
  res.status(200).json({ message: "Waviate API is running", timestamp: new Date().toISOString() }); \
}); \
app.get("/health", (req, res) => { \
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() }); \
}); \
app.get("/api/whatsapp/webhook", (req, res) => { \
  console.log("Query:", req.query); \
  const mode = req.query["hub.mode"]; \
  const token = req.query["hub.verify_token"]; \
  const challenge = req.query["hub.challenge"]; \
  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) { \
    return res.status(200).send(challenge); \
  } \
  return res.sendStatus(403); \
}); \
app.post("/api/whatsapp/webhook", (req, res) => { \
  console.log("Body:", req.body); \
  return res.status(200).json({ status: "received" }); \
}); \
const PORT = process.env.PORT || 3000; \
app.listen(PORT, "0.0.0.0", () => { \
  console.log(`Server running on port ${PORT}`); \
});' > /app/simple-server.js

# Start the server
CMD node simple-server.js 