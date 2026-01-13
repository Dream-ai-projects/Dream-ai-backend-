import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

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

  // ✅ system prompt ONLY ONCE
  if (!history.some(m => m.role === "system")) {
    history.unshift({
      role: "system",
      content: personalities[mode]
    });
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.YOUR_OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://dream-waifu.app",
          "X-Title": "Dream Waifu"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo-0125",
          messages: history,
          temperature: 1.1,
          max_tokens: 350
        })
      }
    );

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch {
    res.json({ reply: "*pouts* something broke…" });
  }
});

app.listen(3000, () => console.log("🔥 Waifu backend live"));
