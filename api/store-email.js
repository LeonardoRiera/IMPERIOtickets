import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email es requerido" });
  }

  console.log(email)
  try {
    const filePath = path.resolve("/tmp/emails.json");
    fs.writeFileSync(filePath, JSON.stringify({ email }));

    res.json({ success: true, message: "Email almacenado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el email" });
  }
}
