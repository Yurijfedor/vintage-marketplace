const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not configured");
}

const corsOrigin = process.env.CORS_ORIGIN;

if (!corsOrigin) {
  throw new Error("CORS_ORIGIN is not configured");
}

export const JWT_SECRET: string = jwtSecret;
export const CORS_ORIGIN: string = corsOrigin;
