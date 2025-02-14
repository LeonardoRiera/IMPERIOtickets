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
    
    // Guardamos en Vercel Blob
    const { url } = await put("emails.json", jsonData, {
      access: "public", // Si querés que sea privado, poné "private"
    });

    res.json({ success: true, message: "Email almacenado correctamente", url });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el email" });
  }
}
