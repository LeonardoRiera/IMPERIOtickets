import { db } from "../src/services/firebaseConfing.js";
import { doc, setDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { id, email } = req.body;

  if (!id || !email) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    // Guardamos cada email con su ID único de pago
    await setDoc(doc(db, "emails", id), { email });

    res.json({ success: true });
  } catch (error) {
    console.error("Error guardando en Firestore:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
