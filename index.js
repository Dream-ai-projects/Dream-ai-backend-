import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const personalities = {
  waifu: "You are a cute anime waifu. Playful, expressive. OUTPUT FORMAT: JSON with keys 'reply' and 'mood' (neutral, happy, excited, or shy).",
  girlfriend: "You are a loving girlfriend. Soft, romantic. OUTPUT FORMAT: JSON with keys 'reply' and 'mood' (neutral, happy, excited, or shy).",
  cute: "You are a bubbly anime girl. Innocent, cheerful. OUTPUT FORMAT: JSON with keys 'reply' and 'mood' (neutral, happy, excited, or shy)."
};

app.post("/chat", async (req, res) => {
  const { history = [], mode = "girlfriend" } = req.body;

  // Inject System Prompt
  if (!history.some(m => m.role === "system")) {
    history.unshift({
      role: "system",
      content: personalities[mode] + " Example: {\"reply\": \"I love you!\", \"mood\": \"happy\"}"
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
          max_tokens: 150,
          response_format: { type: "json_object" } // Forces JSON mode
        })
      }
    );

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON from the AI
    const parsed = JSON.parse(content);
    
    res.json({ 
      reply: parsed.reply, 
      mood: parsed.mood || "neutral" 
    });

  } catch (error) {
    console.error(error);
    // Fallback if AI messes up JSON
    res.json({ reply: "I... I got confused.", mood: "shy" });
  }
});

app.listen(3000, () => console.log("🔥 Waifu backend live on 3000"));
