const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Waviate API is running");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/whatsapp/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  
  console.log("Webhook verification request:", { mode, token, challenge });
  
  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log("Webhook verified successfully");
    return res.status(200).send(challenge);
  }
  
  console.log("Webhook verification failed");
  return res.sendStatus(403);
});

app.post("/api/whatsapp/webhook", (req, res) => {
  console.log("Received webhook data:", req.body);
  return res.status(200).json({ status: "received" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
}); 