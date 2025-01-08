// Config
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
  const response = await fetch('http://localhost:5000/create_preference', requestOptions)
  const json = await response.json()

  return json

}
