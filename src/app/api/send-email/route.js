import mongoose from 'mongoose';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { nanoid } from 'nanoid';

// DB imports
import TicketSchema from '../../models/Ticket';
import EntryCounter from '../../models/Count';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.API_URL_MONGODB);
};

export async function POST(req) {
  const { external_reference } = await req.json();
  const { email, count: quantity, ticketId: payment_id } = external_reference;

  await connectDB();
  const session = await mongoose.startSession();

  // Preparamos aquí, fuera de la transacción, el array de attachments
  let mailAttachments = [];
  let shouldSendEmail = false;

  try {

    await session.withTransaction(async () => {
      // 1) Evitar duplicados
      const existing = await TicketSchema
        .findOne({ payment_id, status: 'active' })
        .session(session);
      if (existing) return;

      // 2) Generar PDFs (QRs)
      for (let i = 0; i < quantity; i++) {
        const qrBase64 = await QRCode.toDataURL(nanoid(), { scale: 8 });
        const pdfBase64 = await generatePDFWithQR(qrBase64);
        mailAttachments.push({
          filename: `entrada_${payment_id}_${i + 1}.pdf`,
          content: pdfBase64,
          encoding: 'base64',
        });
      }

      // 3) Grabar ticket
      await new TicketSchema({
        payment_id,
        email,
        count: quantity,
        status: 'active',
      }).save({ session });

      // 4) Actualizar contador
      await EntryCounter.findOneAndUpdate(
        {},
        { $inc: { count: quantity } },
        { upsert: true, new: true, session }
      );

      // 5) Si llegamos acá, todo salió ok: marcamos para enviar mail
      shouldSendEmail = true;
    });

    // 🚀 Commit exitoso. Ahora, fuera de la transacción, enviamos el mail:
    if (shouldSendEmail) {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: '"Imperio Tickets" <imperiotickets@gmail.com>',
        to: email,
        subject: 'Entradas adjuntas',
        text: 'Aquí están tus entradas.',
        html:`<!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Tu Entrada</title>
          </head>
          <body style="margin:0; padding:0; background-color:#ffffff; font-family:Arial, sans-serif; color:#000;">
            <div style="max-width:600px; margin:auto; padding:20px; border:1px solid #ddd;">
              <div style="text-align:center; margin-bottom:20px;">
                <img src="https://imperiotickets.com/assets/entradaSuperior.png" alt="Logo de Imperio Tickets" style="max-width:600px; margin:auto">
              </div>
              <h1 style="color:#ffffff; text-align:center; background-color:#000; padding:10px 0; border-radius:15px;">
                ¡Gracias por tu compra!</h1>

              <p style="margin:20px 0;">Ya podés disfrutar de tu entrada digital para el evento. A continuación, te compartimos los datos importantes:</p>

              
              <p style="margin-bottom:15px;">⚠️ <strong>IMPORTANTE:</strong> TU ENTRADA ES UN QR CON UN ID ÚNICO y te será requerido en el lugar de acceso al evento. El mismo será escaneado para habilitarte el ingreso.</p>

              <p style="margin-bottom:30px;">Una vez recibido el mail con tu entrada, ES TU RESPONSABILIDAD EVITAR DUPLICADOS ya que sólo se habilitará a la primer persona que ingrese con cada QR.</p>


              <div style="margin-top:30px; font-size:12px; color:#666; text-align:center;">
                Si tenés dudas, escribinos a <a href="mailto:imperiotickets@gmail.com">imperiotickets@gmail.com</a><br>
                ¡Nos vemos en el evento!
              </div>
            </div>
          </body>
          </html>`,
        attachments: mailAttachments,
      });
      console.log('📧 Mail enviado correctamente');
    }

    return new Response(null, { status: 200 });

  } catch (error) {
    console.error('❌ Error en transacción o envío de mail:', error);
    // Si la transacción falló, withTransaction ya hizo abortTransaction.
    // Si el mail falló, la BD ya está comprometida, dependerá de ti reintentar o alertar.
    return new Response(null, { status: 500 });
  } finally {
    session.endSession();
  }
}

// Función para generar el PDF con el QR
const generatePDFWithQR = async (qrBase64) => {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([200, 315])

  const { width, height } = page.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const qrImage = await pdfDoc.embedPng(qrBase64)

  // === Imágenes (banners y logo) ===
  const bannerTop = path.join(process.cwd(), "public", "assets", "entradaSuperior.png" )
  const bannerBottom = path.join(process.cwd(), "public", "assets", "entradaInferior.png" )


  // Pasar todo a pdf
  const bannerTopPdf = await pdfDoc.embedPng(fs.readFileSync(bannerTop))
  const bannerBottomPdf = await pdfDoc.embedPng(fs.readFileSync(bannerBottom))

  // Escalado de banner top
  const bannerTopDims = bannerTopPdf.scale(1)
  const bannerTopScale = width / bannerTopDims.width
  const bannerTopHeight = bannerTopDims.height * bannerTopScale

  // Escalado del banner bottom
  const bannerBottomDims = bannerBottomPdf.scale(1)
  const bannerBottomScale = width / bannerBottomDims.width
  const bannerBottomHeight = bannerBottomDims.height * bannerBottomScale

  // Banners
  page.drawImage(bannerTopPdf, {
    x: 0,
    y: height - bannerTopHeight,
    width: width,
    height: bannerTopHeight,
  })

  page.drawImage(bannerBottomPdf, {
    x: 0,
    y: 0,
    width: width,
    height: bannerBottomHeight,
  })

  // === Texto principal ===
  const mainText = "¡LLEGÓ LA ENTRADA PARA TU EVENTO!";
  const mainTextSize = 7;
  const mainTextWidth = font.widthOfTextAtSize(mainText, mainTextSize);
  const textY = height - bannerTopHeight - 12;

  // Lo pegamos comoun campión
  page.drawText(mainText, {
    x: (width - mainTextWidth) / 2,
    y: textY,
    size: mainTextSize,
    font,
    color: rgb(0, 0, 0),
  });

  // === QR ===
  const qrSize = 80;
  const qrY = textY - qrSize - 10;
  page.drawImage(qrImage, {
    x: (width - qrSize) / 2,
    y: qrY,
    width: qrSize,
    height: qrSize,
  });

  // === Rectángulo de detalles ===
  const rectHeight = 46;
  const rectY = qrY - rectHeight - 10;
  page.drawRectangle({
    x: 0,
    y: rectY,
    width,
    height: rectHeight,
    color: rgb(0, 0, 0),
  });


  // === Detalles del evento ===
  const detailSize = 6;

  const fechaText = "FECHA : 3 DE MAYO";
  const horaText = "HORA : 21 HS";
  const lugarText = "LUGAR : GALPÓN BLANCO";

  const fechaWidth = font.widthOfTextAtSize(fechaText, detailSize);
  const horaWidth = font.widthOfTextAtSize(horaText, detailSize);
  const lugarWidth = font.widthOfTextAtSize(lugarText, detailSize);

  page.drawText(fechaText, {
    x: (width - fechaWidth) / 2,
    y: rectY + rectHeight - 11,
    size: detailSize,
    font,
    color: rgb(1, 1, 1),
  });

  page.drawText(horaText, {
    x: (width - horaWidth) / 2,
    y: rectY + rectHeight - 22,
    size: detailSize,
    font,
    color: rgb(1, 1, 1),
  });

  page.drawText(lugarText, {
    x: (width - lugarWidth) / 2,
    y: rectY + rectHeight - 33,
    size: detailSize,
    font,
    color: rgb(1, 1, 1),
  });


  // === Web (posición exacta) ===
  page.drawText("www.imperiotickets.com", {
    x: 4,
    y: 3,
    size: 3.5,
    font,
    color: rgb(0, 0, 0),
  });


  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes).toString("base64");
};
  