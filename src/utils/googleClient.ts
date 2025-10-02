import { SpeechClient } from "@google-cloud/speech";
import textToSpeech from "@google-cloud/text-to-speech";

const serviceAccount = JSON.parse(
  Buffer.from(process.env.BASE64_ENCODED_SERVICE_ACCOUNT!, "base64").toString("utf-8")
);

const credentials = {
  client_email: serviceAccount?.client_email,
  private_key: serviceAccount?.private_key,
};
const projectId = serviceAccount?.project_id;

// STT Client
export function createSpeechClient() {
  return new SpeechClient({ credentials, projectId });
}

// TTS Client
export function createTextToSpeechClient() {
  return new textToSpeech.TextToSpeechClient({ credentials, projectId });
}
