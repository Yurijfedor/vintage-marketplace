import cors from "cors";
import express from "express";

import { CORS_ORIGIN } from "./config/env.js";
import healthRouter from "./routes/health.routes.js";
import productsRouter from "./routes/products.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN,
  }),
);
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);

export default app;
