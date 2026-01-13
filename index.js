import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv"; // Recommended for managing API keys

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const personalities = {
  waifu: "You are a cute anime waifu. Playful, expressive, affectionate.",
  girlfriend: "You act like the user's girlfriend. Soft, caring, romantic.",
  cute: "You are a sweet, bubbly anime girl. Innocent and cheerful."
};

app.post("/chat", async (req, res) => {
  const { history = [], mode = "girlfriend" } = req.body;

  // System prompt injection
  if (!history.some(m => m.role === "system")) {
    history.unshift({
      role: "system",
      content: personalities[mode] || personalities.waifu
    });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // FIX: Added backticks here
          "Authorization": `Bearer ${process.env.YOUR_OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://dream-waifu.app",
          "X-Title": "Dream Waifu"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo-0125", // Change model here if you want "other AI"
          messages: history,
          temperature: 1.1,
          max_tokens: 350
        })
      }
    );

    const data = await response.json();
    
    // Check if OpenRouter gave a valid response
    if (data.choices && data.choices[0]) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      console.error("API Error:", data);
      res.json({ reply: "API Error (Check server logs)" });
    }

  } catch (error) {
    console.error(error);
    res.json({ reply: "pouts something broke…" });
  }
});

app.listen(3000, () => console.log("🔥 Waifu backend live on port 3000"));
