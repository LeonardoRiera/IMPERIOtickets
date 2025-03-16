import React from "react";
import { useForm } from "react-hook-form";
import registerService from "../../services/register.service";
import './Register.scss'

export default function RegisterForm() {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {

    const body = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      repeat_password: data.repeatPassword,
      status: 1
    }

    const response = await registerService(body)

    console.log(response)

  };

  const password = watch("password");

  return (
    <form onSubmit={handleSubmit((data) => submit(data))} id="register-form">
      <h4 className="registerTitle">Ingresa Tus <span className="registerColor">Datos</span> Para Crear Tu <span className="registerColor">Usuario</span></h4>
      <input
        {...register("email", {
          required: "El email es obligatorio",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/,
            message: "Email inválido",
          },
        })}
        placeholder="Email"
        className="registerInput"
      />

      {errors.email && <p className="errorMessage">{errors.email.message}</p>}

      <input {...register("firstName")} placeholder="Nombre" className="registerInput" />

      <input
        {...register("lastName", { required: "El apellido es obligatorio" })}
        placeholder="Apellido"
        className="registerInput"
      />

      {errors.lastName && <p className="errorMessage">{errors.lastName.message}</p>}

      <input
        type="password"
        {...register("password", { required: "La contraseña es obligatoria" })}
        placeholder="Contraseña"
        className="registerInput"
      />

      {errors.password && <p className="errorMessage">{errors.password.message}</p>}

      <input
        type="password"
        {...register("repeatPassword", {
          required: "Repite la contraseña",
          validate: (value) =>
            value === password || "Las contraseñas no coinciden",
        })}
        placeholder="Repite la contraseña"
        className="registerInput"
      />

      {errors.repeatPassword && <p className="errorMessage">{errors.repeatPassword.message}</p>}

      <input type="submit" value="Registrarse" className="registerButton" />
    </form>
  );
}
