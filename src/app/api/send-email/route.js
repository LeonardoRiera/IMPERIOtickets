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

const runTransactionWithRetry = async (operationFn, session, maxRetries = 5) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      session.startTransaction();
      await operationFn(session);
      await session.commitTransaction();
      return;
    } catch (error) {
      if (error.codeName === 'WriteConflict') {
        await session.abortTransaction();
        console.warn(`⚠️ WriteConflict, reintentando (${attempt + 1}/${maxRetries})...`);
        await new Promise((res) => setTimeout(res, 100 * (attempt + 1))); // espera creciente
      } else {
        await session.abortTransaction();
        throw error;
      }
    }
  }
  throw new Error("🚨 Máximo número de reintentos alcanzado");
};


export async function POST(req) {
  const response = await req.json();
  const { email, count: quantity, ticketId: payment_id } = response.external_reference;

  await connectDB();
  const session = await mongoose.startSession();

  let mailAttachments = [];
  let shouldSendEmail = false;
  
  try {
    await runTransactionWithRetry(async (session) => {
      const existingTicket = await TicketSchema.findOne({ 
        payment_id,
        status: 'active'
      }).session(session);
  
      if (existingTicket) {
        console.log('Ya existía el ticket');
        return;
      }
  
      // Crear PDFs
      for (let i = 0; i < quantity; i++) {
        const qrBase64 = await QRCode.toDataURL(nanoid(), { scale: 8 });
        const pdfBase64 = await generatePDFWithQR(qrBase64);
        mailAttachments.push({
          filename: `entrada_${payment_id}_${i + 1}.pdf`,
          content: pdfBase64,
          encoding: "base64",
        });
      }
  
      const newTicket = new TicketSchema({
        payment_id,
        email,
        count: quantity,
        status: 'active'
      });
  
      await newTicket.save({ session });
  
      await EntryCounter.findOneAndUpdate(
        {},
        { $inc: { count: quantity } },
        { upsert: true, new: true, session }
      );
  
      shouldSendEmail = true; // ⚠️ Habilitamos el envío fuera del scope de la transacción
  
    }, session);
  
    if (shouldSendEmail) {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: { 
          user: process.env.EMAIL_USER, 
          pass: process.env.EMAIL_PASS 
        },
      });
  
      await transporter.sendMail({
        from: '"Imperio Tickets" <imperiotickets@gmail.com>',
        to: email,
        subject: "Entradas adjuntas",
        text: "Aquí están tus entradas.",
        html: `<html>...el contenido de antes...</html>`,
        attachments: mailAttachments,
      });
  
      console.log('Mail enviadaso');
    }
  } catch (error) {
    console.error("❌ Error:", error);
    return new Response(null, { status: 200 });
  } finally {
    session.endSession();
  }

  return new Response(null, { status: 200 });
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
  