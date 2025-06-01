import React from "react";
import { useForm } from "react-hook-form";
import loginService from "../../services/login.service";
import "./Login.scss";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    // React Hook Form ya previene la recarga
    try {
      const response = await loginService(data);
      console.log("Respuesta del backend:", response);
      // if (response.token) {
      //   localStorage.setItem("token", response.token);
      //   alert("Inicio de sesión exitoso");
      // }
    } catch (error) {
      console.error("Error en loginService:", error);
    }
  };

  return (
    <form className="containerForm" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h4 className="loginTitle">
        Ingresa Tu <span className="loginColor">Mail</span> y{" "}
        <span className="loginColor">Contraseña</span> para Empezar!
      </h4>

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
      {errors.email && (
        <p className="errorMessage">{errors.email.message}</p>
      )}

      {/* Campo Contraseña */}
      <input
        type="password"
        {...register("password", {
          required: "La contraseña es obligatoria",
        })}
        placeholder="Contraseña"
        className="loginInput"
      />
      {errors.password && (
        <p className="errorMessage">{errors.password.message}</p>
      )}

      {/* Botón de enviar */}
      <button type="submit" className="loginButton">
        Ingresar
      </button>
    </form>
  );
}
