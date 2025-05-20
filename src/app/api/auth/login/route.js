import { NextResponse } from 'next/server';          
import { connectToDatabase } from '../../lib/mongodb';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';      

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

    const user = await User.findOne({ email: email.toLowerCase().trim() }); 
    if (!user) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      ); 
    }

    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Credenciales inválidas' },
        { status: 401 }
      ); 
    }

    return NextResponse.json(
      {
        message: 'Autenticación exitosa',
        user: {
          _id: user._id,
          email: user.email
        }
      },
      { status: 200 }
    ); 
  } catch (error) {
    console.error('Error en /api/auth/login:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
