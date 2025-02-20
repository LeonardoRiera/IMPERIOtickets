// Config
const apiUrl = import.meta.env.VITE_API_URL_SERVER;

export default async function registerService (body) {

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body)
  }


  console.log(body)

  // Default response
  const response = await fetch(`${apiUrl}register`, requestOptions)

  const json = await response.json()

  return json

}