import { createTextToSpeechClient } from "./googleClient";

export async function convertTextToAudio(
  text: string,
  language = "en-US",
  //  voice = "en-US-Wavenet-C"
): Promise<Buffer> {
  const client = createTextToSpeechClient();

  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: { languageCode: language, ssmlGender: "NEUTRAL" },
    audioConfig: {
      audioEncoding: "MP3",
      // speakingRate: 1,
      // pitch: -1.0,
    },
  });

  if (!response.audioContent) {
    throw new Error("No audio content returned from TTS API");
  }

  return Buffer.from(response.audioContent as Uint8Array);
}

// Voice options:
// "en-US-Wavenet-F"	🌸 Soft Female	Smooth, gentle, calm (best for soft tone)
// "en-US-Wavenet-C"	🌼 Soft Female	Slightly brighter and friendly
// "en-GB-Wavenet-A"	🇬🇧 British	Polished and calm UK accent
// "en-IN-Wavenet-C"	🇮🇳 Indian	Warm, clear Indian English accent
// "en-US-Neural2-F"	✨ Natural Female	Very human-like soft tone (newer model)
