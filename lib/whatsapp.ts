const DEFAULT_REPLY =
  "Gracias por escribirnos a Once FC. En breve te ayudamos con tu reserva o con cualquier duda sobre los entrenamientos.";

export function buildAutoReply(message: string): string {
  const normalized = message.toLowerCase();

  if (!normalized) {
    return DEFAULT_REPLY;
  }

  if (/hola|buenas|buenos|hello|hi/.test(normalized)) {
    return "¡Hola! Gracias por escribirnos a Once FC. ¿Quieres reservar una sesión o saber más sobre nuestros entrenamientos?";
  }

  if (/reserva|reservar|turno|agendar/.test(normalized)) {
    return "Perfecto. Cuéntanos tu ciudad y horario preferido y te ayudamos a encontrar la mejor opción para tu reserva.";
  }

  if (/horario|horarios|cuando/.test(normalized)) {
    return "Nuestros entrenamientos varían por sede y grupo. Dinos tu ciudad y te compartimos los horarios disponibles.";
  }

  if (/precio|costo|cuanto|pago/.test(normalized)) {
    return "Podemos compartir detalles de las sesiones y los planes según tu sede. Escríbenos tu ciudad y te orientamos.";
  }

  if (/ayuda|duda|información|info/.test(normalized)) {
    return "Claro. Escríbenos tu ciudad o el tipo de entrenamiento que buscas y te respondemos con la información más útil.";
  }

  return DEFAULT_REPLY;
}
