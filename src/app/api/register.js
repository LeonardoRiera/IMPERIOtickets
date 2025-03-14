import Register from "./models/Register.js";
import bcrypt from "bcryptjs";
import express from "express";
import cors from "cors";

const app = express()

app.use(cors())

export default async function handler(req, res) {

  console.log("la request es", req)

  if (req.method === "POST") {
    try {
      const { email, password, repeat_password, first_name, last_name, status } = req.body;

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
        status
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
