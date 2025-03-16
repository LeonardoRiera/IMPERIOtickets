// Config
const apiUrl = process.env.NEXT_PUBLIC_API_URL_SERVER;

export default async function mercadoPagoService (body) {

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body)
  }

  // Default response
  try {

    const response = await fetch(`${apiUrl}create_preference`, requestOptions)
    const data = await response.json()

    return data
    
  } catch (error) {
    console.log(error)
    throw error
  }


}
