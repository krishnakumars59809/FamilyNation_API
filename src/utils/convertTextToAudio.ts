import { createTextToSpeechClient } from "./googleClient";

export async function convertTextToAudio(text: string, language = "en-US"): Promise<Buffer> {
  const client = createTextToSpeechClient();

  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: { languageCode: language, ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" },
  });

  if (!response.audioContent) {
    throw new Error("No audio content returned from TTS API");
  }

  return Buffer.from(response.audioContent as Uint8Array);
}
