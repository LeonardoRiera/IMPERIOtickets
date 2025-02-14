// store-email.js
import { setEmail } from './storage';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email es requerido" });
  }

  console.log('Email recibido:', email);

  try {
    setEmail(email); // Guardamos el email en memoria
    console.log('Email almacenado en memoria:', email);

    res.json({ success: true, message: "Email almacenado correctamente" });
  } catch (error) {
    console.error('Error en store-email:', error);
    res.status(500).json({ error: "Error al guardar el email", details: error.message });
  }
}