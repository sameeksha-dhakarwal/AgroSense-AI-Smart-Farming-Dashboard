import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

/* DEBUG */
console.log("AI ROUTE KEY:", process.env.OPENAI_API_KEY);

/* Safe OpenAI init */
let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn("⚠️ OpenAI key missing → using fallback AI");
}

/* 🌾 SMART FARMER FALLBACK AI */
const getFallbackResponse = (message) => {
  const msg = message.toLowerCase();

  if (msg.includes("fertilizer") || msg.includes("fertiliser")) {
    return "For wheat, use nitrogen-rich fertilizers like urea. Apply in 2 to 3 stages for best results.";
  }

  if (msg.includes("irrigation") || msg.includes("water")) {
    return "Irrigate crops early morning or evening. Avoid overwatering to prevent root damage.";
  }

  if (msg.includes("soil")) {
    return "Maintain soil moisture between 60 to 70 percent. Use organic compost to improve fertility.";
  }

  if (msg.includes("weather")) {
    return "Check rainfall and humidity before irrigation. Avoid watering before rain.";
  }

  if (msg.includes("disease")) {
    return "Remove infected leaves early and use appropriate fungicides to prevent spread.";
  }

  if (msg.includes("hello") || msg.includes("hi")) {
    return "Hello farmer! How can I help you today?";
  }

  return "Monitor soil moisture, weather, and crop health regularly for better yield.";
};

/* POST /api/ai/ask */
router.post("/ask", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    /* 🟢 TRY OPENAI FIRST */
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are an expert agriculture assistant. Give short, practical farming advice.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        });

        const reply = completion.choices?.[0]?.message?.content;

        if (reply) {
          return res.json({ reply });
        }

      } catch (err) {
        console.warn("⚠️ OpenAI failed → switching to fallback AI");
        console.error(err?.message);
      }
    }

    /* 🔥 FALLBACK AI ALWAYS RETURNS */
    const fallbackReply = getFallbackResponse(message);

    return res.json({
      reply: fallbackReply,
    });

  } catch (err) {
    console.error("❌ AI ROUTE ERROR:", err);

    return res.json({
      reply: "Something went wrong, but I am still here to help you with farming advice.",
    });
  }
});

export default router;