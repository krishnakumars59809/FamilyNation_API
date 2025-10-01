import { createSign } from "crypto";

export const convertAudioToText = async (buffer: Buffer) => {
  try {
    console.log("🔧 Using simplified approach...");

    const audioBytes = buffer.toString("base64");
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL!;

    // Create JWT manually
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    })).toString('base64url');

    const dataToSign = `${header}.${payload}`;
    
    const sign = createSign('RSA-SHA256');
    sign.update(dataToSign);
    
    let formattedKey = privateKey;
    if (!formattedKey.includes('BEGIN PRIVATE KEY')) {
      formattedKey = `-----BEGIN PRIVATE KEY-----\n${formattedKey}\n-----END PRIVATE KEY-----`;
    }

    const signature = sign.sign(formattedKey, 'base64url');
    const jwt = `${dataToSign}.${signature}`;

    // Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
    });

    const { access_token } = await tokenResponse.json();

    // Call STT API
    const sttResponse = await fetch('https://speech.googleapis.com/v1/speech:recognize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: { encoding: "MP3", sampleRateHertz: 16000, languageCode: "en-US" },
        audio: { content: audioBytes }
      }),
    });

    const sttData = await sttResponse.json();
    const transcription = sttData.results
      ?.map((r: any) => r.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join("\n");

    console.log("✅ Transcription:", transcription);
    return transcription;

  } catch (err: any) {
    console.error("❌ Error:", err.message);
    throw new Error(`Failed to transcribe audio: ${err.message}`);
  }
};