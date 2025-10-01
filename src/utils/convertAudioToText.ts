import { createSpeechClient } from "./googleClient";

export const convertAudioToText = async (buffer: Buffer) => {
  try {
    const client = await createSpeechClient();

    const audioBytes = buffer.toString("base64");

    const audio = { content: audioBytes };
    const config = {
      encoding: "MP3" as const,
      sampleRateHertz: 16000,
      languageCode: "en-US",
    };

    const [response] = await client.recognize({ audio, config });

    const transcription = response.results
      ?.map((r:any) => r.alternatives?.[0]?.transcript)
      .join("\n");

    console.log("📝 Transcription:", transcription);
    return transcription;
  } catch (err: any) {
    console.error("❌ Google STT error:", err?.message || err);
    throw new Error("Failed to transcribe audio");
  }
};
