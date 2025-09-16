import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT || 3000);

// Inicie APENAS o servidor principal da aplicação.
// Nada de outro server/health separado aqui.
app.listen(PORT, () => {
  console.log(`Server listening on :${PORT}`);
  console.log(`Railway Environment: ${process.env.RAILWAY_ENVIRONMENT || "local"}`);
});
