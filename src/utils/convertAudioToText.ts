export const convertAudioToText = async (buffer: Buffer) => {
  try {
    console.log("🎵 Audio Buffer Info:", {
      environment: 'Vercel',
      bufferLength: buffer.length,
      fileSignature: buffer.slice(0, 4).toString('hex')
    });

    const audioBytes = buffer.toString("base64");
    
    // Get access token using service account
    const accessToken = await getAccessToken();
    
    console.log("✅ Got access token, calling Speech-to-Text API...");

    const response = await fetch('https://speech.googleapis.com/v1/speech:recognize', {
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

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Google STT API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    
    const transcription = data.results
      ?.map((r: any) => r.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join("\n");

    console.log("✅ Service Account Transcription successful:", transcription);
    return transcription;

  } catch (err: any) {
    console.error("❌ Service Account approach error:", err.message);
    throw new Error(`Failed to transcribe audio: ${err.message}`);
  }
};

async function getAccessToken(): Promise<string> {
  try {
    // Correct import for google-auth-library
    const { GoogleAuth } = await import('google-auth-library');
    
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL!;

    const auth = new GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    
    return tokenResponse.token!;
    
  } catch (error: any) {
    console.error("❌ Failed to get access token:", error.message);
    throw error;
  }
}