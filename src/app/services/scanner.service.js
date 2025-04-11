// Config
const apiUrl = process.env.NEXT_PUBLIC_API_URL_SERVER;

export default async function validateEntryService (body) {

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(body)
  }

  console.log(body)
  // Default response
  const response = await fetch(`${apiUrl}validate-entry`, requestOptions)
  const json = await response.json()

  return json

}