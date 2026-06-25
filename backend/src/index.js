const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  console.warn("[WARN] DATABASE_URL não está definida. Rotas de banco podem falhar até configurar a variável.");
}

const veloriosRoutes = require("./modules/velorios/velorios.routes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Rotas
app.use("/api", veloriosRoutes);

// Tratamento de erro global
app.use((err, _req, res, _next) => {
  console.error("Erro não tratado:", err);
  res.status(500).json({ error: "Erro interno do servidor" });
});

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`API running on port ${port}`);
});