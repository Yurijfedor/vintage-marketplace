const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

const corsOrigin = process.env.CORS_ORIGIN;

if (!corsOrigin) {
  throw new Error("CORS_ORIGIN is not configured");
}

const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudinaryCloudName) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not configured");
}

if (!cloudinaryApiKey) {
  throw new Error("CLOUDINARY_API_KEY is not configured");
}

if (!cloudinaryApiSecret) {
  throw new Error("CLOUDINARY_API_SECRET is not configured");
}

export const JWT_SECRET: string = jwtSecret;

export const CORS_ORIGIN: string[] = corsOrigin
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const CLOUDINARY_CLOUD_NAME: string = cloudinaryCloudName;
export const CLOUDINARY_API_KEY: string = cloudinaryApiKey;
export const CLOUDINARY_API_SECRET: string = cloudinaryApiSecret;
