require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();

app.use((req, res, next) => {
  console.log("➡️ " + req.method + " " + req.path);
  next();
});


/* 🔥 REQUIRED for ngrok free tier */
app.use((req, res, next) => {
  res.setHeader("ngrok-skip-browser-warning", "true");
  next();
});

app.use(express.json());

const VERIFY_TOKEN = "verify123";
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

/* Webhook verification */
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

/* Receive messages */
app.post("/webhook", async (req, res) => {
  // ALWAYS ACK FAST
  res.sendStatus(200);

  console.log("🔥 POST /webhook received");
  console.log(JSON.stringify(req.body, null, 2));

  const entry = req.body.entry?.[0];
  const change = entry?.changes?.[0];
  const value = change?.value;
  const message = value?.messages?.[0];

  if (message?.type !== "text") return;

  const from = message.from;
  const text = message.text.body;

  console.log(`📩 From ${from}: ${text}`);

  try {
    await axios.post(
      `https://graph.facebook.com/v24.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        type: "text",
        text: { body: `You typed: ${text}` }
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err) {
    console.error("❌ Send error:", err.response?.data || err.message);
  }
});

app.listen(3000, () => {
  console.log("✅ Bot running on port 3000");
});
