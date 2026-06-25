const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
require("dotenv").config();

const veloriosRoutes = require("./modules/velorios/velorios.routes");

const app = express();

app.use(helmet());
app.use(cors());
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