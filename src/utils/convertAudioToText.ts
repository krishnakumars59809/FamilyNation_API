import { SignJWT } from 'jose';
import { createPrivateKey } from 'crypto';

export const convertAudioToText = async (buffer: Buffer) => {
  try {
    console.log("🎵 Audio Buffer Info:", {
      environment: 'Vercel',
      bufferLength: buffer.length,
      fileSignature: buffer.slice(0, 4).toString('hex')
    });

    const audioBytes = buffer.toString("base64");
    
    // Create JWT token manually
    const privateKey = createPrivateKey({
      key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      format: 'pem'
    });

    const now = Math.floor(Date.now() / 1000);
    
    const jwt = await new SignJWT({
      scope: 'https://www.googleapis.com/auth/cloud-platform',
    })
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
      .setIssuer(process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL!)
      .setAudience('https://oauth2.googleapis.com/token')
      .setIssuedAt()
      .setExpirationTime(now + 3600)
      .sign(privateKey);

    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      throw new Error(`Token error: ${tokenData.error}`);
    }

    const accessToken = tokenData.access_token;

    // Call Speech-to-Text API directly
    const sttResponse = await fetch('https://speech.googleapis.com/v1/speech:recognize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          encoding: "MP3",
          sampleRateHertz: 16000,
          languageCode: "en-US",
        },
        audio: {
          content: audioBytes,
        },
      }),
    });

    const sttData = await sttResponse.json();
    
    if (!sttResponse.ok) {
      throw new Error(`STT API error: ${sttData.error?.message || JSON.stringify(sttData)}`);
    }

    const transcription = sttData.results
      ?.map((r: any) => r.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join("\n");

    console.log("✅ Manual API Transcription successful:", transcription);
    return transcription;

  } catch (err: any) {
    console.error("❌ Manual API error:", err.message);
    throw new Error(`Failed to transcribe audio: ${err.message}`);
  }
};