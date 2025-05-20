'use client'
import React, { Suspense, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { getProductoById } from '../../../services/firebase.service';
import './CardDetail.scss';
import Link from 'next/link';
import Image from 'next/image';
import EntradasCount from '@/app/_components/EntradasCount/EntradasCount';
import Loader from '@/app/_components/Loader/Loader';

export default function CardDetail () {

  // Local State
  const [producto, setProducto] = useState(null);
  const [count, setCount] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] =useState(true)

  const { id } = useParams();

  // Hooks
  const {
    register,
    watch,
    formState: { errors },
  } = useForm();


  // EFECTO AUXILIAR
  useEffect(() => {
    window.location.href = "/";
  }, []);


  // Effects  
  useEffect(() => {
    fetchProducto();
  }, [id]);

  useEffect(() => {
    if (producto) {
      setTotal(producto.price * count);
    }
  }, [producto, count]);

  // Constants
  const email = watch("email");
  const repeatEmail = watch("repeatEmail");
  const isButtonDisabled = email !== repeatEmail || !email || !repeatEmail;

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

  const fetchProducto = async () => {
    try {
      const prodData = await getProductoById(id);
      setProducto(prodData);
      setTotal(prodData.price * count);
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  };

  return (
   (producto?.imageDetail && !loading) ?
    <div className='DetailContainer'>
      <div className='bannercito'>
        <div className='fotoContainer'>
          <Image 
            src={producto.imageDetail} 
            alt=""  
            className='imageBannercito'
            width={700}
            height={700}
            style={{objectFit: "contain"}}
            />
        </div>

        <div className='infoDetail'>
          <p className='introDetail'>Detalles del Evento</p>
          <h2 className='tituloDetail'>{producto.title}</h2>
          <p className='detailTexto'>Fecha:  {producto.dia} {producto.fecha}</p>
          <p className='detailTexto'>Lugar: {producto.lugar}</p>
          <p className='detailTexto'>Hora: {producto.hora}</p>
          <p className='detailTexto'>Clasificación: {producto.clasificacion}</p>
          <p className='detailTexto'>Precio: $6000</p>
          <p className='detailTexto'>Cargo de servicio (12%): $720</p>
        </div>
      </div>

      <div className='rowDetail'>


        <div className='descripcionContainer'>


          <h3 className='subtitleDetail'>Cuantas Entradas Querés?</h3>

          <div className='precioCountDiv'>

            <EntradasCount count={count} increment={increment} decrement={decrement} />

            <p className='detallesCount'>Precio por Entrada: .................................. $6000</p>
            <p className='detallesCount'>Cargo del servicio: .................................. $720</p>

          </div>

          <p className='detallesCountTotal'>Total: ${total.toFixed(2)}</p>

        </div>


      </div>

      {/* Form Section */}
      <div className='emailFormContainer'>

        <form className='formContainer'>

          {/* Campo para el nombre */}
          <div className='formGroup'>
            <label>Ingresa tu Nombre:</label>

            <input
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: {
                  value: 2,
                  message: "Debe tener al menos 2 caracteres"
                }
              })}
              className='input'
              type="text"
              placeholder="Ingresa tu Nombre"
              required
            />
            {errors.nombre && <p>{errors.nombre.message}</p>}
          </div>

          <h3 className='correoTitulo'>Ahora Ingresa el Correo Electrónico donde quieres recibir tus entradas:</h3>


          {/* Campo para el primer correo */}
          <div className='formGroup'>
            <label >Ingresa tu Email:</label>

            <input
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/,

                  message: "Email Iqnválido",

                },
              })}
              className='input'
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
              className='input'
              type="email"
              placeholder="Confirma tu correo electrónico"
              required
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          <Link
              href={{
                pathname: '/pages/venta-final',
                query: { 
                  imageDetail: producto.imageDetail,
                  title: producto.title,
                  price: producto.price,
                  count: count,
                  email: email,
                  total: total
                }
              }}
              className={`${isButtonDisabled ? 'disabled' : ''} botonComprarEntrada`}
              aria-disabled={isButtonDisabled}
            >
              Comprar Entrada
            </Link>


          <p className='importante2'>Una vez confirmado el email se activará el botón de pagar.</p>

        </form>

      </div>
    </div>
    :
    <Loader />
  );
};
