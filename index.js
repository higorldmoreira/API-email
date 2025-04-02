import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // 🔓 Libera CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // ou coloque seu domínio específico no lugar de '*'
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Responde pré-flight (necessário para navegadores)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 🚫 Permite apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { name, email, subject, message } = req.body;

  // 🛡️ Validação básica
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // 🚀 Configuração do Nodemailer (SMTP Gmail com App Password)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      }
    });

    // 📩 Envio do e-mail
    const info = await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_TO,
      subject: `Contato via portfólio: ${subject}`,
      text: message,
      html: `
        <h2>Nova mensagem via portfólio</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <p><strong>Mensagem:</strong><br>${message}</p>
      `
    });

    // ✅ Resposta de sucesso
    return res.status(200).json({ success: true, message: 'E-mail enviado com sucesso!', id: info.messageId });

  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return res.status(500).json({ success: false, error: 'Erro ao enviar o e-mail.' });
  }
}
