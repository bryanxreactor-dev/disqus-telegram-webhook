let lastCommentId = null;

export default async function handler(req, res) {
  const API_KEY = "x4Z4jmz39lUBrHMO... (tu API Key)";
  const TELEGRAM_BOT_TOKEN = "8865897801:AAHFafFS4IcYhOJUqitYZ4pRzJ3UpRKAYu4";
  const TELEGRAM_CHAT_ID = "-1004437242993";
  const FORUM_NAME = "animev1-net";

  try {
    // Consultar el último comentario de Disqus mediante su API oficial
    const response = await fetch(`https://disqus.com/api/3.0/posts/list.json?api_key=x4Z4jmz39lUBrHMORlwQ4TF5ReEaX0VPdj6qUQYN0RhBPhUW5Q9bXVbgcaRvOYWc&forum=${FORUM_NAME}&limit=1&order=desc`);
    const data = await response.json();

    if (data.code === 0 && data.response && data.response.length > 0) {
      const comment = data.response[0];

      // Si es un comentario nuevo
      if (comment.id !== lastCommentId) {
        lastCommentId = comment.id;

        const usuario = comment.author ? comment.author.name : "Anónimo";
        const mensajeTexto = comment.raw_message || "Sin texto";
        const urlEntrada = comment.threadUrl || "https://www.animev1.net";

        const mensajeTelegram = `💬 <b>¡Nuevo comentario en AnimeV1!</b>\n\n` +
                                `👤 <b>Usuario:</b> ${usuario}\n` +
                                `📝 <b>Mensaje:</b> ${mensajeTexto}\n\n` +
                                `🔗 <a href="${urlEntrada}">Ver en el blog</a>`;

        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: mensajeTelegram,
            parse_mode: 'HTML'
          })
        });

        return res.status(200).json({ status: "Notificación enviada", commentId: comment.id });
      }
    }

    return res.status(200).json({ status: "Sin comentarios nuevos" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
