import React from 'react';
import { useState, useEffect } from 'react';
import EntradasCount from '../EntradasCount/EntradasCount'
import { useLocation, Navigate } from 'react-router-dom';
import '../CardDetail/CardDetail.css';
import { Link } from 'react-router-dom';
import emailService from '../../services/email.service';
import { v4 as uuidv4 } from "uuid";

const CardDetail = () => {

  // Este useEffect asegura que la página se desplace hacia arriba al cargar el componente, me encanto!!
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // El array vacío indica que se ejecutará solo al montar el componente


  const location = useLocation();

  // Verificación para evitar errores
  if (!location.state) {
    // Puedes redirigir o mostrar un mensaje de error
    return <Navigate to="/" />; // Redirige a la página principal
  }

  const { image, image2, imageDetail, title, price, dia, fecha, hora, lugar, description, clasificacion } = location.state;

  /* contador */
  const [count, setCount] = useState(1); // Contador de entradas

  const [total, setTotal] = useState(0); // Estado para el total

  const increment = () => {
    if(count > 0) {
      setCount(count+1)
    }
  }

  const decrement = () => {
    if(count > 1) {
      setCount(count-1)
    }
  }

  // Cálculo del total cada vez que cambian price o count
  useEffect(() => {
    /* const serviceCharge = price * 0.12; */
    /* const newTotal = (price + serviceCharge) * count; */
    const newTotal = price * count;

    setTotal(newTotal); // Actualizamos el total
  }, [price, count]);


  // Definimos los estados para manejar los correos electrónicos
  const [email, setEmail] = useState(''); // Almacena el primer correo

  const [confirmEmail, setConfirmEmail] = useState(''); // Almacena la confirmación del correo

  const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Controla si el botón "Comprar Entrada" está habilitado o no

  const [errorMessage, setErrorMessage] = useState(''); // Mensaje de error si los correos no coinciden

  // Función para validar si los correos coinciden
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    validarCorreos(e.target.value, confirmEmail);
  };

  // const submit = async () => {
  //   const idEmail = uuidv4();

  //   const body = {
  //     email: email
  //   }

  //   const response = await emailService(body)

  //   console.log(response)

  // };

  const handleConfirmEmailChange = (e) => {
    setConfirmEmail(e.target.value);
    validarCorreos(email, e.target.value);
  };

  // Función para validar si los correos son iguales y habilitar/deshabilitar el botón
  const validarCorreos = (email1, email2) => {
    if (email1 === email2 && email1 !== '') {
      setIsButtonDisabled(false); // Habilitamos el botón si los correos coinciden y no están vacíos
      setErrorMessage(''); // Limpiamos cualquier mensaje de error
    } else if (email2 === '') {
      setIsButtonDisabled(true); // Deshabilitamos el botón si no coinciden
    } else {
      setIsButtonDisabled(true); // Deshabilitamos el botón si no coinciden
      setErrorMessage('Los correos electrónicos no coinciden.'); // Mostramos un mensaje de error
    }
  };


  const handleFeedback = async () => {
    try {
      // Realizar la solicitud GET al servidor (suponiendo que está en localhost:3000)
      const response = await axios.get('http://147.79.107.178:3000/feedback');

      console.log('Respuesta del servidor:', response.data); // Manejar la respuesta
      alert('¡Solicitud exitosa! Respuesta del servidor: ' + response.data.message);
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      alert('Hubo un error al hacer la solicitud');
    }
  };


  return (
    <div className='DetailContainer'>
      <div className='bannercito'>

        <div className='fotoContainer'>

          <img src={imageDetail} alt="" className='imageBannercito' />

        </div>

        <div className='infoDetail'>
          <p className='introDetail'>Detalles del Evento</p>

          <h2 className='tituloDetail'>{title}</h2>

          <p className='detailTexto'><span className="material-symbols-outlined icon">calendar_month</span> Fecha:  {dia} {fecha}</p>

          <p className='detailTexto'> <span className="material-symbols-outlined icon">where_to_vote</span> Lugar: {lugar}</p>

          <p className='detailTexto'><span className="material-symbols-outlined icon">alarm_on</span> Hora: {hora}</p>

          <p className='detailTexto'><span className="material-symbols-outlined icon">verified_user</span> Clasificación: {clasificacion}</p>

          <p className='detailTexto'><span className="material-symbols-outlined icon">local_atm</span> Precio: ${price}</p>

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
              className='imput'
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Ingresa tu correo electrónico"
              required
            />
          </div>

          {/* Campo para la confirmación del correo */}
          <div className='formGroup'>
            <label>Confirma tu Email:</label>

            <input
              className='imput'
              type="email"
              value={confirmEmail}
              onChange={handleConfirmEmailChange}
              placeholder="Confirma tu correo electrónico"
              required
            />
          </div>

          {/* Mensaje de error si los correos no coinciden */}
          {errorMessage && <p className='errorMessage' style={{ color: 'red' }}>{errorMessage}</p>}


          {/* Link habilitado o deshabilitado según la validación de los correos */}
          {isButtonDisabled ? (
          // Si los correos no coinciden, mostramos un mensaje o botón inactivo
            <button disabled className='buttonDisabled'>
                  Comprar Entrada
            </button>
          ) : (
          // Si los correos coinciden, mostramos el link activo
            <Link
              to={`/VentaFinal`}
              state={{ imageDetail, title, price, count, total, email }}
              className='botonComprarEntrada'
            >
                  Comprar Entrada
            </Link>
          )}


          <p className='importante2'>Una vez confirmado el email se activará el botón de pagar.</p>

        </form>

      </div>

    </div>

  )
}

export default CardDetail