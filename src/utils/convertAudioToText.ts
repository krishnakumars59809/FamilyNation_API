// import { createSpeechClient } from "./googleClient";

// export const convertAudioToText = async (buffer: Buffer) => {
//   try {
//     // Add audio validation
//     console.log("🎵 Audio Buffer Info:", {
//       environment: process.env.VERCEL ? 'Vercel' : 'Local',
//       bufferLength: buffer?.length,
//       bufferType: buffer?.constructor?.name,
//       isBuffer: Buffer.isBuffer(buffer),
//       firstBytes: buffer?.slice(0, 4)?.toString('hex')
//     });

//     // Validate audio buffer
//     if (!buffer || !Buffer.isBuffer(buffer)) {
//       throw new Error("Invalid audio buffer: not a Buffer");
//     }

//     if (buffer.length < 1024) {
//       throw new Error(`Audio buffer too small: ${buffer.length} bytes`);
//     }

//     // Check if it's actually MP3 (MP3 files start with specific signatures)
//     const fileSignature = buffer.slice(0, 4).toString('hex').toUpperCase();
//     console.log("🔍 File signature:", fileSignature);
    
//     // Common MP3 signatures: 'FF FB', 'FF F3', '49 44 33' (ID3)
//     const isLikelyMp3 = fileSignature.startsWith('FF') || fileSignature.startsWith('494433');
//     console.log("🤔 Likely MP3:", isLikelyMp3);

//     const client = await createSpeechClient();
//     const audioBytes = buffer.toString("base64");

//     const audio = { content: audioBytes };
//     const config = {
//       encoding: "MP3" as const,
//       sampleRateHertz: 16000,
//       languageCode: "en-US",
//     };

//     console.log("🔄 Sending to Google STT...");
//     const [response] = await client.recognize({ audio, config });

//     const transcription = response.results
//       ?.map((r:any) => r.alternatives?.[0]?.transcript)
//       .join("\n");

//     console.log("✅ Transcription successful");
//     return transcription;
    
//   } catch (err: any) {
//     console.error("❌ Google STT error details:", {
//       message: err.message,
//       code: err.code,
//       details: err.details,
//       environment: process.env.VERCEL ? 'Vercel' : 'Local'
//     });
    
//     throw new Error(`Failed to transcribe audio: ${err.message}`);
//   }
// };
import { GoogleAuth } from "google-auth-library";

export const convertAudioToText = async (buffer: Buffer) => {
  try {
    console.log("🎵 Audio Buffer Info:", {
      environment: 'Vercel',
      bufferLength: buffer.length,
      fileSignature: buffer.slice(0, 4).toString('hex')
    });

    const audioBytes = buffer.toString("base64");
    
    // Use REST API instead of gRPC client
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL!,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = await auth.getClient();
    // const projectId = await auth.getProjectId();

    const url = `https://speech.googleapis.com/v1/speech:recognize`;

    const requestBody = {
      config: {
        encoding: "MP3",
        sampleRateHertz: 16000,
        languageCode: "en-US",
      },
      audio: {
        content: audioBytes,
      },
    };

    console.log("🔄 Sending REST API request to Google STT...");

    const response = await client.request({
      url,
      method: 'POST',
      data: requestBody,
    });

    const data:any = response.data;

    const transcription = data.results
      ?.map((r: any) => r.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join("\n");

    console.log("✅ REST API Transcription successful:", transcription);
    return transcription;

  } catch (err: any) {
    console.error("❌ Google STT REST API error:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data
    });
    throw new Error(`Failed to transcribe audio: ${err.message}`);
  }
};