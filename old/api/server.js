import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";
// Cargar automáticamente todos los archivos en / api /
import path from "path";
import { fileURLToPath } from "url";

// Cargar configuración
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
const PORT = 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

const __dirname = path.dirname(fileURLToPath(process.url));

const apiDir = path.join(__dirname);

fs.readdirSync(apiDir).forEach(async (file) => {

  if (!file.endsWith(".js") || file === "server.js" || file === "models") return;

  console.log(`📁 Cargando archivo: ${file}`);

  try {
    const module = await import(`./${file}`);

    if (!module.default || typeof module.default !== "function") {
      console.error(`⚠️  Error en ${file}: No exporta una función.`);

      return;
    }

    const route = `/${file.replace(".js", "")}`;

    app.all(route, module.default);
    console.log(`📌 Endpoint cargado: ${route}`);
  } catch (error) {
    console.error(`❌ Error al importar ${file}:`, error);
  }
});

// Conexión a la DB y levantar servidor
const bootstrap = async () => {
  // eslint-disable-next-line no-undef
  await mongoose.connect(process.env.API_URL_MONGODB)
};

bootstrap();
