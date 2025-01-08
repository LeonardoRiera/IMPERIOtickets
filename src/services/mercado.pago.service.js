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
  let success = false
  let data = {error: 'There was an issue with your request'}

  try {

    const response = await fetch('http://localhost:5173/', requestOptions)
    const json = await response.json()

    if (response.status === 200) {

      success = true
      data = json

    } else if (json.error_message) {

      data.error = json.error_message

    }

  } catch (e) {

    console.log(e)

  }

  return {
    success: success,
    data: data
  }

}
