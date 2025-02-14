import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";


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
    const jsonData = JSON.stringify({ email });

    // Guarda el email en Vercel Blob
    const blob = await put("emails.json", jsonData, {
      access: "public", // Puede ser "private" si no querés que sea visible
      contentType: "application/json",
    });

    res.json({ success: true, message: "Email almacenado correctamente", url: blob.url });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el email" });
  }
}
