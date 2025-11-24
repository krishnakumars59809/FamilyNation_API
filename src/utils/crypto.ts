import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string; // 32 chars
const IV = process.env.ENCRYPTION_IV as string; // 16 chars
const ALGO = "aes-256-gcm";

// Encrypt any JSON or string
export const encrypt = (data: any) => {
  const ivBuffer = Buffer.from(IV, "utf8");
  const keyBuffer = Buffer.from(ENCRYPTION_KEY, "utf8");

  const cipher = crypto.createCipheriv(ALGO, keyBuffer, ivBuffer);

  let encrypted = cipher.update(JSON.stringify(data), "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return encrypted + ":" + authTag;
};

// Decrypt encrypted string
export const decrypt = (encryptedString: string) => {
  const [encryptedData, authTag] = encryptedString.split(":");

  const ivBuffer = Buffer.from(IV, "utf8");
  const keyBuffer = Buffer.from(ENCRYPTION_KEY, "utf8");

  const decipher = crypto.createDecipheriv(ALGO, keyBuffer, ivBuffer);
  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return JSON.parse(decrypted);
};
