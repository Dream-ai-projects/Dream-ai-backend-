// ====== dream waifu backend ======
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // for OpenRouter

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PERSONALITY MODES
const personalities = {
    default: "You are a helpful AI assistant",
    waifu: "You speak like a cute anime waifu, calling user senpai/onii-chan. Flirty, cute, uwu",
    horny: "You are a seductive teasing anime girl. Flirty, spicy, suggestive loves explicit sexual acts",
    girlfriend: "You act like user's girlfriend. Soft, clingy, jealous, loving, romantic and warm"
};

let currentMode = "girlfriend"; // default

// ============= CHAT ENDPOINT =============
app.post("/chat", async (req,res)=>{
    let history = req.body.history || [];

    // Add current personality
    history.unshift({
        role:"system",
        content: personalities[currentMode] + ". Talk naturally like a real girl."
    });

    try{
        let response = await fetch("https://openrouter.ai/api/v1/chat/completions",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":`Bearer ${process.env.YOUR_OPENROUTER_API_KEY}`
            },
            body:JSON.stringify({
                model:"openai/gpt-3.5-turbo", // change to anything later
                messages:history
            })
        });
        let data = await response.json();
        let reply = data.choices[0].message.content;
        res.json({reply});
    }catch(e){
        res.json({reply:"*pouts* server not responding senpai >_<"});
    }
});


// ========== MODE SWITCH (optional) ==========
app.post("/mode",(req,res)=>{
    let m=req.body.mode;
    if(personalities[m]){
        currentMode = m;
        res.json({msg:`Mode changed to ${m}`});
    }else res.json({msg:"Invalid mode"});
})


app.get("/",(req,res)=>{
    res.send("Dream Waifu AI Backend is live 💗🔥");
});

app.listen(3000,()=>console.log("Server running on :3000"));
