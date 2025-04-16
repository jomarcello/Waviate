FROM node:18-slim
WORKDIR /app
RUN npm init -y && npm install express body-parser
RUN echo "// Server code" > /app/server.js
RUN echo "const express = require(\"express\");" >> /app/server.js
RUN echo "const bodyParser = require(\"body-parser\");" >> /app/server.js
RUN echo "const app = express();" >> /app/server.js
RUN echo "app.use(bodyParser.json());" >> /app/server.js
RUN echo "app.get(\"/\", (req, res) => { res.send(\"Waviate API is running\"); });" >> /app/server.js
RUN echo "app.get(\"/health\", (req, res) => { res.json({ status: \"ok\" }); });" >> /app/server.js
RUN echo "app.get(\"/api/whatsapp/webhook\", (req, res) => {" >> /app/server.js
RUN echo "  const mode = req.query[\"hub.mode\"];" >> /app/server.js
RUN echo "  const token = req.query[\"hub.verify_token\"];" >> /app/server.js
RUN echo "  const challenge = req.query[\"hub.challenge\"];" >> /app/server.js
RUN echo "  console.log(\"Webhook verification:\", { mode, token, challenge });" >> /app/server.js
RUN echo "  if (mode === \"subscribe\" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {" >> /app/server.js
RUN echo "    return res.status(200).send(challenge);" >> /app/server.js
RUN echo "  }" >> /app/server.js
RUN echo "  return res.sendStatus(403);" >> /app/server.js
RUN echo "});" >> /app/server.js
RUN echo "app.post(\"/api/whatsapp/webhook\", (req, res) => {" >> /app/server.js
RUN echo "  console.log(\"Received webhook data:\", req.body);" >> /app/server.js
RUN echo "  return res.status(200).json({ status: \"received\" });" >> /app/server.js
RUN echo "});" >> /app/server.js
RUN echo "const PORT = process.env.PORT || 3000;" >> /app/server.js
RUN echo "app.listen(PORT, \"0.0.0.0\", () => {" >> /app/server.js
RUN echo "  console.log(`Server running on port ${PORT}`);" >> /app/server.js
RUN echo "});" >> /app/server.js
EXPOSE 3000
CMD [ "node", "server.js" ]
