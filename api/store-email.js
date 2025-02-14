import { db } from "../src/services/firebaseConfing";
import { doc, setDoc } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Falta el email" });
  }

  try {
    await setDoc(doc(db, "config", "store-email"), { email });

    res.json({ success: true });
  } catch (error) {
    console.error("Error guardando en Firestore:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
