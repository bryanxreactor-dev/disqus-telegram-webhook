export default async function handler(req, res) {
  // Solo aceptar peticiones POST de Disqus
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const body = req.body;

  try {
    // Verificar si Disqus envió los datos del comentario
    if (body && body.object) {
      const comentario = body.object.raw_message || "Nuevo comentario publicado";
      const usuario = body.object.author ? body.object.author.name : "Anónimo";
      const urlEntrada = body.object.thread ? body.object.thread.link : "https://www.animev1.net";

      const TELEGRAM_BOT_TOKEN = "8865897801:AAHFafFS4IcYhOJUqitYZ4pRzJ3UpRKAYu4";
      const TELEGRAM_CHAT_ID = "-1004437242993";

      const mensaje = `💬 <b>¡Nuevo comentario en AnimeV1!</b>\n\n` +
                      `👤 <b>Usuario:</b> ${usuario}\n` +
                      `📝 <b>Mensaje:</b> ${comentario}\n\n` +
                      `🔗 <a href="${urlEntrada}">Ver entrada en el blog</a>`;

      // Enviar la notificación a la API de Telegram
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: mensaje,
          parse_mode: 'HTML',
          disable_web_page_preview: false
        })
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error procesando el webhook:", error);
    return res.status(500).json({ error: error.message });
  }
}
