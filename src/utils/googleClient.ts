// import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
// import { SpeechClient } from "@google-cloud/speech";

// const secretClient = new SecretManagerServiceClient({
//   credentials: {
//     client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
//     private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
//       /\\n/g,
//       "\n"
//     ),
//   },
//   projectId: process.env.GOOGLE_PROJECT_ID,
// });

// // async function getServiceAccountFromSecret(secretName: string) {
// //   try {
// //     const [version] = await secretClient.accessSecretVersion({
// //       name: secretName,
// //     });

// //     if (!version.payload?.data) throw new Error("Secret payload is empty");

// //     const creds = JSON.parse(version.payload.data.toString());

// //     // Fix private key formatting
// //     creds.private_key = creds.private_key.replace(/\\n/g, "\n").trim();

// //     console.log("✅ Secret fetched successfully");
// //     return creds;
// //   } catch (err: any) {
// //     console.error(
// //       "❌ Failed to fetch secret or invalid key:",
// //       err.message || err
// //     );
// //     throw err;
// //   }
// // }

// export async function createSpeechClient() {
//   const project_id = process.env.GOOGLE_PROJECT_ID;
//   const project_secrets_version =
//     process.env.GOOGLE_PROJECT_SECRETS_VERSION || "latest";
//   if (!project_id)
//     throw new Error("Missing GOOGLE_PROJECT_ID in environment variables");
//   if (!project_secrets_version)
//     throw new Error(
//       "Missing GOOGLE_PROJECT_SECRETS_VERSION in environment variables"
//     );
//   // const secretCreds = await getServiceAccountFromSecret(
//   //   `projects/${project_id}/secrets/familyNation/versions/${project_secrets_version}`
//   // );

//   const client = new SpeechClient({
//       credentials: {
//     client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
//     private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
//       /\\n/g,
//       "\n"
//     ),
//   },
//   projectId: process.env.GOOGLE_PROJECT_ID,
//   });

//   console.log("✅ Speech client created successfully");
//   return client;
// }
import { SpeechClient } from "@google-cloud/speech";
import { GoogleAuth } from "google-auth-library";

export async function createSpeechClient() {
  try {
    // Validate environment variables
    const requiredEnvVars = [
      'GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL',
      'GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY',
      'GOOGLE_PROJECT_ID'
    ];
    
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing ${envVar} in environment variables`);
      }
    }

    // Format private key properly
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY!
      .replace(/\\n/g, '\n')
      .trim();

    // Use GoogleAuth with modern authentication
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL!,
        private_key: privateKey,
      },
      projectId: process.env.GOOGLE_PROJECT_ID!,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    // Create SpeechClient with the auth instance
    const client = new SpeechClient({ auth });

    // Test the connection
    await client.getProjectId();
    
    console.log("✅ Speech client created successfully with modern authentication");
    return client;
  } catch (error: any) {
    console.error("❌ Failed to create Speech client:", error.message);
    throw new Error(`Speech client initialization failed: ${error.message}`);
  }
}