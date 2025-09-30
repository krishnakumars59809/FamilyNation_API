import fs from "fs";
import { SpeechClient } from "@google-cloud/speech";
const client: SpeechClient = new SpeechClient();

export const convertAudioToText = async (audioPath: string) => {
  try {
    if (!audioPath || !fs.existsSync(audioPath)) {
      throw new Error("No audio file uploaded or file does not exist");
    }

    const file = fs.readFileSync(audioPath);
    const audioBytes = file.toString("base64");

    const audio = { content: audioBytes };
    const config = {
      encoding: "MP3" as const,
      sampleRateHertz: 16000,
      languageCode: "en-US",
    };

    const [response] = await client.recognize({
      audio,
      config,
    });

    const transcription = response.results
      ?.map((r) => r.alternatives?.[0]?.transcript)
      .join("\n");

    console.log("Transcription:", transcription);

    // Clean up the temporary file
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }

    return transcription;
  } catch (error: any) {
    // Clean up file even if error occurs
    if (audioPath && fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }

    console.error("Google STT error:", error.message);
    throw new Error("Failed to transcribe audio");
  }
};
