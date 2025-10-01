import { SpeechClient } from "@google-cloud/speech";

// Decode Base64 string
const serviceAccount = JSON.parse(
  Buffer.from(process.env.BASE64_ENCODED_SERVICE_ACCOUNT!, "base64").toString("utf-8")
);

export async function createSpeechClient() {
  const client = new SpeechClient({
    credentials: {
      client_email: serviceAccount.client_email,
      private_key: serviceAccount.private_key,
    },
    projectId: serviceAccount.project_id,
  });

  console.log("✅ Speech client created successfully");
  return client;
}
