import "dotenv/config";
import ai from "./config/gemini.js";

const response = await ai.models.generateContent({
  model: "gemini-3.1-flash-lite",
  contents: "Give me one simple MERN Stack interview question.",
});

console.log(response.text);