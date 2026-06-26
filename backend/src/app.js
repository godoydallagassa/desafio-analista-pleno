const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const veloriosRoutes = require("./modules/velorios/velorios.routes");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", veloriosRoutes);

app.use((err, _req, res, _next) => {
  console.error("Erro não tratado:", err);
  res.status(err.status || 500).json({
    error: err.status ? err.message : "Erro interno do servidor",
  });
});

module.exports = app;
