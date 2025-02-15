import express from "express";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Cargar configuración
dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Cargar automáticamente todos los archivos en /api/
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
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
  await mongoose.connect(process.env.API_URL_MONGODB);
  app.listen(port, () => console.log(`🚀 Servidor corriendo en http://localhost:${port}`));
};

bootstrap();
