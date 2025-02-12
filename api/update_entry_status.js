import express from "express";
import cors from "cors";

import Entry from './models/Entry.js'

const app = express()

app.use(cors());

app.post("/update_entry_status", async (req, res) => {
    const { entryId } = req.body;  // El ID único de la entrada
    const newStatus = 'ok';  // El estado que quieres actualizar
  
    try {
      // Buscar el entryId en la base de datos
      const entry = await Entry.findOne({ entryId });
  
      if (!entry) {
        return res.status(404).json({ error: 'Entrada no encontrada' });
      }
  
      // Actualizar el estado
      entry.status = newStatus;
      await entry.save();
  
      res.status(200).json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
      console.error('Error actualizando el estado:', error);
      res.status(500).json({ error: 'Error al actualizar el estado' });
    }
  });