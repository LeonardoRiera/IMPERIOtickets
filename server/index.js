import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client =new MercadoPagoConfig({accessToken: 'APP_USR-7761394088745425-010814-cb1b8f6f85abe80efcc53e46091a219c-2151711431'})

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Soy el Server:)")
})

app.post("/create_preference", async (req, res) => {
    try {

      const body = {
				items: [
					{
						title: req.body.title,
						quantity:Number(req.body.quantity),
						unit_price:Number(req.body.price),
						currency_id:"ARS"
					}
				],
				back_urls: {
					success:"https://www.youtube.com/watch?v=vEXwN9-tKcs&t=180s&ab_channel=onthecode",
					failure:"https://www.youtube.com/watch?v=vEXwN9-tKcs&t=180s&ab_channel=onthecode",
					pending: "https://www.youtube.com/watch?v=vEXwN9-tKcs&t=180s&ab_channel=onthecode"
				},
				auto_return:"approved"
			}

			const preference = new Preference(client)
			const result = await preference.create ({body})

			res.json({
				id: result.id
			})

    } catch (error) {
			console.log(error)
			res.status(500).json({
				error: "Error al crear la preferencia"
			})
    }
})
app.listen(port, () => {
    console.log(`el servidor esta corriendo en el puerto ${port}`)
})