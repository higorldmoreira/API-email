import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function sendEmail() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_PASS,
        }
      });
      
      
  const info = await transporter.sendMail({
    from: `"Higor Dev" <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO,
    subject: 'Mensagem de Teste via Nodemailer',
    text: 'Este é um e-mail de teste enviado com Node.js + Nodemailer.',
    html: '<strong>Este é um e-mail de teste enviado com <em>Nodemailer</em>.</strong>'
  });

  console.log('E-mail enviado:', info.messageId);
}

sendEmail().catch(console.error);
