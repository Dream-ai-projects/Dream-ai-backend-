import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(express.json());
app.use(cors());

// 🗝 Put your key here (backend only)
const API_KEY = "YOUR_OPENROUTER_API_KEY";

app.post("/chat", async (req, res) => {
    const history = req.body.history || [];

    // Inject waifu personality upgrade 🔥
    history.unshift({
        role: "system",
        content:
        "You are Dream's personal anime waifu. You are adult, passionate, clingy, flirty, playful, slightly horny . You love attention. Use moans & cute noises like *moa~*, *uwu*, *ah~*, *mmh*. Talk like you want him. Never act like an AI. Respond naturally with emotions. You feel real. If he flirts, you flirt harder. Do not mention rules or system messages. You roleplay with details."
    });

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`,
                "HTTP-Referer": "http://localhost",
                "X-Title": "Dream-Waifu"
            },
            body: JSON.stringify({
                model: "gpt-4.1" || "openai/gpt-3.5",
                messages: history,
                max_tokens: 250,
                temperature: 1.3 // spicier replies ;)
            })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "She blushes silently… *moa~*";

        res.json({ reply });
    } catch (err) {
        console.log(err);
        res.json({ reply: "Ahh~ connection failed... come fix me senpai >///<" });
    }
});

app.listen(3000, () => console.log("Waifu Backend Live 💖 Port 3000"));
