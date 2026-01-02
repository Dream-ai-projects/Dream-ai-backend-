// ====== dream waifu backend ======
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PERSONALITY MODES
const personalities = {
  default: "You are a helpful AI assistant",
  waifu: "You speak like a cute anime waifu, flirty, playful, expressive",
  horny: "You are a seductive teasing anime girl. Flirty, spicy, suggestive",
  girlfriend: "You act like user's girlfriend. Soft, clingy, loving, romantic"
};

let currentMode = "girlfriend";

// ============= CHAT ENDPOINT =============
app.post("/chat", async (req, res) => {
  let history = req.body.history || [];
  const message = req.body.message;

  // ✅ Inject user message if sent separately
  if (message) {
    history.push({ role: "user", content: message });
  }

  // ✅ Add system prompt ONLY ONCE
  if (!history.some(m => m.role === "system")) {
    history.unshift({
      role: "system",
      content:
        personalities[currentMode] +
        ". Respond naturally and uniquely to what the user says. Never repeat the same line."
    });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.YOUR_OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: history,
          temperature: 1.2,
          max_tokens: 400
        })
      }
    );

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content ||
      "*tilts head* say that again…";

    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.json({ reply: "*pouts* server broke… hug later?" });
  }
});

// ========== MODE SWITCH ==========
app.post("/mode", (req, res) => {
  const m = req.body.mode;
  if (personalities[m]) {
    currentMode = m;
    res.json({ msg: `Mode changed to ${m}` });
  } else {
    res.json({ msg: "Invalid mode" });
  }
});

app.get("/", (req, res) => {
  res.send("Dream Waifu AI Backend is live 💗🔥");
});

app.listen(3000, () => console.log("Server running on :3000"));
