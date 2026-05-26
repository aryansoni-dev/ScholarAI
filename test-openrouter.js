const OpenAI = require("openai");
require("dotenv").config({ path: ".env.local" });

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function main() {
  try {
    const response = await openai.chat.completions.create({
      model: "google/gemini-1.5-flash",
      messages: [{ role: "user", content: "Hello" }],
    });
    console.log(response.choices[0].message.content);
  } catch (e) {
    console.error("ERROR:", e);
  }
}
main();
