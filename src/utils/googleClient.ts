import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

// Parse service account key from env variable
const credentials = JSON.parse(process.env.GCP_SERVICE_KEY!);
console.log("kk credentials", credentials);
// Create client with credentials
const client = new SecretManagerServiceClient({
  credentials,
  projectId: credentials.project_id,
});

// Access secret
async function accessSecret(secretName: string) {
  try {
    const name = `projects/${credentials.project_id}/secrets/${secretName}/versions/latest`;
    const [version] = await client.accessSecretVersion({ name });
    const secretPayload = version.payload?.data?.toString() || '';
    console.log(`Secret value: ${secretPayload}`);
    return secretPayload;
  } catch (err) {
    console.error('Error accessing secret:', err);
  }
}

// Example usage
(async () => {
  const mySecret = await accessSecret('familynation');
    console.log('Retrieved secret:', mySecret);
})();
