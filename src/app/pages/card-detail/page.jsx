'use client'
import React, { Suspense, useState } from 'react';
import EntradasCount from '../../components/EntradasCount/EntradasCount';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import './CardDetail.css';
import Link from 'next/link';

export default function CardDetailContent () {
  
  // Local state
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [imageDetail, setImageDetail] = React.useState(null);
  const [title, setTitle] = React.useState('');
  const [price, setPrice] = React.useState(0);
  const [dia, setDia] = React.useState('');
  const [fecha, setFecha] = React.useState(0);
  const [hora, setHora] = React.useState(0);
  const [lugar, setLugar] = React.useState('');
  const [clasificacion, setClasificacion] = React.useState('');

  // Hooks
  const searchParams = useSearchParams();
  const {
    register,
    watch,
    formState: { errors },
  } = useForm();

  // Constants
  const email = watch("email");
  const repeatEmail = watch("repeatEmail");

  const isButtonDisabled = email !== repeatEmail || !email || !repeatEmail;
  
  
  // Effects

  React.useEffect(() => {
    setImageDetail(searchParams.get('imageDetail'));
    setTitle(searchParams.get('title'));
    setPrice(searchParams.get('price'));
    setDia(searchParams.get('dia'));
    setFecha(searchParams.get('fecha'));
    setHora(searchParams.get('hora'));
    setLugar(searchParams.get('lugar'));
    setClasificacion(searchParams.get('clasificacion'));
  }, [searchParams]);

  React.useEffect(() => {
    const newTotal = price * count;
    setTotal(newTotal);
  }, [price, count]);

  // Methods
  const increment = () => {
    if (count > 0) {
      setCount(count + 1);
    }
  };

  const decrement = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  return (
    <Suspense fallback={<div>Cargando Detalles...</div>}>

    <div className='DetailContainer'>
      <div className='bannercito'>

        <div className='fotoContainer'>

          <img src={imageDetail} alt="" className='imageBannercito' />

        </div>

        <div className='infoDetail'>
          <p className='introDetail'>Detalles del Evento</p>

          <h2 className='tituloDetail'>{title}</h2>

          <p className='detailTexto'>Fecha:  {dia} {fecha}</p>

          <p className='detailTexto'>Lugar: {lugar}</p>

          <p className='detailTexto'>Hora: {hora}</p>

          <p className='detailTexto'>Clasificación: {clasificacion}</p>

          <p className='detailTexto'>Precio: ${price}</p>

          {/* <p className='importante'>Importante: al precio de tu entrada se le agregará el costo por servicio de venta digital.</p> */}

        </div>

      </div>

      <div className='rowDetail'>

      <div className='descripcionContainer'>


        <h3 className='subtitleDetail'>Cuantas Entradas Querés?</h3>

        <div className='precioCountDiv'>

          <EntradasCount count={count} increment={increment} decrement={decrement} />

          <p className='detallesCount'>Precio por Entrada: .................................. ${price}</p>

          {/* <p className='detallesCount'>Cargos por Servicio (12%): ......................... ${price * 0.12 } </p> */}

        </div>

        {/* <p className='detallesCountTotal'>Total: ${total}</p> */}
        <p className='detallesCountTotal'>Total: ${total.toFixed(2)}</p>

      </div>

      </div>

      {/* Sección de formulario para ingresar y confirmar el correo */}
      <div className='emailFormContainer'>
        <h3 className='correoTitulo'>Ingresa el Correo Electrónico <br />donde quieres recibir tus entradas:</h3>

        <form className='formContainer'>
          {/* Campo para el primer correo */}
          <div className='formGroup'>
            <label >Ingresa tu Email:</label>

            <input
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/,
                  message: "Email inválido",
                },
              })}
              className='imput'
              type="email"
              placeholder="Ingresa tu correo electrónico"
              required
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          {/* Campo para la confirmación del correo */}
          <div className='formGroup'>
            <label>Confirma tu Email:</label>

            <input
              {...register("repeatEmail", {
                required: "El email debe coincidir",
                validate: (value) =>
                  value === email || 'Los emails no coinciden'
              })}
              className='imput'
              type="email"
              placeholder="Confirma tu correo electrónico"
              required
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          <Link
            href={{
              pathname:'/pages/venta-final',
              query:{ imageDetail, title, price, count, total, email }}
            }
            className={`${isButtonDisabled ? 'disabled' : ''  } botonComprarEntrada`}
            aria-disabled={isButtonDisabled}
          >
                Comprar Entrada
          </Link>


          <p className='importante2'>Una vez confirmado el email se activará el botón de pagar.</p>

        </form>

      </div>    
    </div>
    </Suspense>

  );
};
