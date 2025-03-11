// Configuración de la API
const apiUrl = import.meta.env.VITE_API_URL_SERVER;

const loginService = async (data) => {
  try {
    const response = await fetch(`${apiUrl}/Login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
     
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error en el inicio de sesión");
    }

    return response.json();
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

export default loginService;
