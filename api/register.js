import Register from "./models/Register.js"; // Asegúrate de que la ruta sea correcta
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password, repeat_password, first_name, last_name, entryId } = req.body;

      // 🔴 Validar que las contraseñas coincidan
      if (password !== repeat_password) {
        return res.status(400).json({ error: "Las contraseñas no coinciden" });
      }

      // 🔐 Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // 🆕 Crear el usuario
      const newUser = new Register({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        entryId,
      });

      // Guardar en la base de datos
      await newUser.save();

      return res.status(201).json({ message: "Usuario registrado con éxito" });

    } catch (error) {
      console.error("Error en el registro:", error);

      return res.status(500).json({ error: "Error en el servidor" });
    }
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}
