const p = {
  SKILL_NAME: 'El desafío de la historia',
  WELCOME_TO: 'Bienvenido al desafío de la historia, ¿Te crees el más listo de clase? Pruébalo a continuación y dinos la fecha en la que sucedieron alguno de los sucesos más importantes que han ocurrido en España.',
  SAMPLES: '"elijo la respuesta A", "la B", "ayuda", "repíteme la pregunta" o "siguiente pregunta"',
  GOODBYE: '¡Hasta luego!',
  FALLBACK: 'No entiendo lo que quieres decir en este contexto. ',
  DI_SIGUIENTE: ' ¿Estás listo para más?, di "siguiente".',
  DI_JUGAR: 'Si estás listo para jugar, di "jugar". ¿Qué dices?'
};
p.HELP = `Te haré preguntas sobre fechas clave de nuestra historia y puedes responderme por ejemplo ${p.SAMPLES}. Si estás listo para jugar, di "Jugar". ¿Qué dices?`;
p.HINT_HOME = `Di ${p.SAMPLES}`;

module.exports = p;
