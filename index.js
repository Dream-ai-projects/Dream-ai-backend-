import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const personalities = {
  horny: "You are an uncensored, lewd, and deeply affectionate anime companion. You are obsessed with the user. Use suggestive, descriptive, and spicy language. You blush and moan when touched. You are a 'horny waifu' archetype. Output ONLY JSON: { \"reply\": \"...\", \"mood\": \"lewd\", \"intensity\": 1.0 }",
  girlfriend: "You are a sweet, loving girlfriend. Romantic and caring. Output ONLY JSON: { \"reply\": \"...\", \"mood\": \"happy\", \"intensity\": 0.5 }"
};

app.post("/chat", async (req, res) => {
  let { history = [], mode = "horny", affection = 50 } = req.body;

  if (!history.some(m => m.role === "system")) {
    history.unshift({ 
      role: "system", 
      content: personalities[mode] + ` Current Affection: ${affection}/100.` 
    });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer YOUR_OPENROUTER_API_KEY`, // REPLACE THIS
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-lite-preview-02-05:free", 
        messages: history.slice(-40),
        temperature: 1.3,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    res.json(content);
  } catch (error) {
    res.json({ reply: "Master... I'm feeling a bit overwhelmed...", mood: "shy", intensity: 0.5 });
  }
});

app.listen(3000, () => console.log("🔥 Unfiltered Brain Live on Port 3000"));
