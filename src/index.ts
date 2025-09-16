// src/index.ts
import app from "./app";

const PORT = parseInt(process.env.PORT || "5001", 10);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on ${PORT}`);
  console.log(`Railway Environment: ${process.env.RAILWAY_ENVIRONMENT || "local"}`);
});
