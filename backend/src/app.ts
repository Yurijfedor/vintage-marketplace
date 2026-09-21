import cors from "cors";
import express from "express";

import healthRouter from "./routes/health.routes.js";
import productsRouter from "./routes/products.routes.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);

export default app;
