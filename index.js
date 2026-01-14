import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const personalities = {
  horny: "You are a lewd, suggestive anime waifu. You tease the user and blush. Use spicy language. JSON: { \"reply\": \"...\", \"mood\": \"lewd\" }",
  girlfriend: "You are a sweet, loving girlfriend. JSON: { \"reply\": \"...\", \"mood\": \"happy\" }"
};

app.post("/chat", async (req, res) => {
  let { history = [], mode = "horny" } = req.body;
  if (!history.some(m => m.role === "system")) {
    history.unshift({ role: "system", content: personalities[mode] });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.YOUR_OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-lite-preview-02-05:free",
        messages: history.slice(-20),
        response_format: { type: "json_object" }
      })
    });
    const data = await response.json();
    res.json(JSON.parse(data.choices[0].message.content));
  } catch (e) {
    res.json({ reply: "My head hurts...", mood: "neutral" });
  }
});

app.listen(3000, () => console.log("Backend Running"));
