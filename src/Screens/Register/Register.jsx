import React from "react";
import { useForm } from "react-hook-form";
import registerService from "../../services/register.service";

export default function RegisterForm() {

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const submit = async (data) => {

    const body = {
      first_name: data.firstName
    }

    const response = await registerService(body)

    console.log(response)

    console.log(data);
  };

  const password = watch("password");

  return (
    <form onSubmit={handleSubmit((data) => submit(data))} id="register-form">
      <input
        {...register("email", {
          required: "El email es obligatorio",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/,
            message: "Email inválido",
          },
        })}
        placeholder="Email"
      />

      {errors.email && <p>{errors.email.message}</p>}

      <input {...register("firstName")} placeholder="Nombre" />

      <input
        {...register("lastName", { required: "El apellido es obligatorio" })}
        placeholder="Apellido"
      />

      {errors.lastName && <p>{errors.lastName.message}</p>}

      <input
        type="password"
        {...register("password", { required: "La contraseña es obligatoria" })}
        placeholder="Contraseña"
      />

      {errors.password && <p>{errors.password.message}</p>}

      <input
        type="password"
        {...register("repeatPassword", {
          required: "Repite la contraseña",
          validate: (value) =>
            value === password || "Las contraseñas no coinciden",
        })}
        placeholder="Repite la contraseña"
      />

      {errors.repeatPassword && <p>{errors.repeatPassword.message}</p>}

      <input type="submit" value="Registrarse" />
    </form>
  );
}
