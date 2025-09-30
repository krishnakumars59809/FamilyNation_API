import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const sendTextToAI = async (text: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4, gpt-3.5-turbo
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: text },
      ],
    });

    return response.choices[0].message?.content || "No response from AI";
  } catch (error) {
    console.error("Error sending text to AI:", error);
    throw new Error("Failed to get AI response");
  }
};
