require("dotenv").config();

if (!process.env.DATABASE_URL) {
  console.warn(
    "[WARN] DATABASE_URL não está definida. Rotas de banco podem falhar até configurar a variável."
  );
}

const app = require("./app");

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`API running on port ${port}`);
});
