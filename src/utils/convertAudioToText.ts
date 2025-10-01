import fs from "fs";
import { createSpeechClient } from "./googleClient";

export const convertAudioToText = async (audioPath: string) => {
  try {
    if (!audioPath || !fs.existsSync(audioPath))
      throw new Error("Audio file not found");

    const client = await createSpeechClient();

    const file = fs.readFileSync(audioPath);
    const audioBytes = file.toString("base64");

    const audio = { content: audioBytes };
    const config = {
      encoding: "MP3" as const,
      sampleRateHertz: 16000,
      languageCode: "en-US",
    };

    const [response] = await client.recognize({ audio, config });

    const transcription = response.results
      ?.map((r) => r.alternatives?.[0]?.transcript)
      .join("\n");

    console.log("📝 Transcription:", transcription);

    // Cleanup
    fs.existsSync(audioPath) && fs.unlinkSync(audioPath);

    return transcription;
  } catch (err: any) {
    fs.existsSync(audioPath) && fs.unlinkSync(audioPath);
    console.error("❌ Google STT error:", err?.message || err);
    throw new Error("Failed to transcribe audio");
  }
};
