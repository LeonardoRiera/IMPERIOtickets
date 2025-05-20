// Config
const apiUrl = process.env.NEXT_PUBLIC_API_URL_SERVER;

export default async function loginService (body) {

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body)
  }

  const response = await fetch(`${apiUrl}auth/login`, requestOptions)
  const json = await response.json()

  return json

}