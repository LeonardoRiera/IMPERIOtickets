import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import loginService from "../../services/login.service"; // Servicio para enviar los datos de login
import './Login.less'; 

export default function LoginForm() {
  // useForm para manejar el formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Función que maneja el envío del formulario
  const submit = async (data) => {
    try {
      const response = await loginService(data); // Llamada al backend
      console.log(response); 

      if (response.token) {
        localStorage.setItem("token", response.token); // Guardar el token en localStorage
        alert("Inicio de sesión exitoso");
        // Acá Redirigimos a otra página y actualizamos el estado de autenticación
        navigate("/PanelAdminEvento"); 
      } else {
        alert("Error en el inicio de sesión");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      alert("Error en el inicio de sesión");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} id="login-form">
      <h4 className="loginTitle">Ingresa Tu <span className="loginColor">Mail</span> y <span className="loginColor">Contraseña</span> para Empezar!</h4>
      {/* Campo Email */}
      <input
        type="email"
        {...register("email", {
          required: "El email es obligatorio",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/,
            message: "Email inválido",
          },
        })}
        placeholder="Email"
        className="loginInput"
      />
      {errors.email && <p className="errorMessage">{errors.email.message}</p>}

      {/* Campo Contraseña */}
      <input
        type="password"
        {...register("password", {
          required: "La contraseña es obligatoria",
        })}
        placeholder="Contraseña"
        className="loginInput"
      />
      {errors.password && <p className="errorMessage">{errors.password.message}</p>}

      {/* Botón de enviar */}
      <input type="submit" value="Ingresar" className="loginButton" />
    </form>
  );
}
