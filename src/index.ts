import dotenv from "dotenv";
import app from "./app";

dotenv.config();

// Use a porta fornecida pelo provedor (Railway) ou 3000 como fallback.
// NÃO fixe 8080 aqui.
const PORT = Number(process.env.PORT);

app.listen(PORT, () => {
  console.log(`Main server listening on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || "development"})`);
});
