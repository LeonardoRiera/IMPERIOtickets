import { connectToDatabase } from '../../lib/mongodb';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Debes enviar email y password en el body' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Verificar si ya existe el usuario
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { message: 'El usuario ya existe' },
        { status: 400 }
      );
    }

    // Generar hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    // Crear el usuario con el esquema definido
    const newUser = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPwd
    });

    return NextResponse.json(
      {
        message: 'Usuario registrado exitosamente',
        user: { _id: newUser._id, email: newUser.email }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error en /api/auth/register:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
