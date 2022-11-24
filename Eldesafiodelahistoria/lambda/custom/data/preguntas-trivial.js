const data = {
  CATEGORIAS: [
    {
      id: '1',
      nombre: 'Fácil',
    },
    {
      id: '2',
      nombre: 'Medio fácil',
    },
    {
      id: '3',
      nombre: 'Difícil',
    }
  ],
  PREGUNTAS: [
    {
      id: 1,
      categoria: '1',
      enunciado: '¿En qué año se produjo la famosa batalla de Trafalgar?',
      respuestas: [
        {
          respuesta: '1750',
          correcta: false,
        },
        {
          respuesta: '1805',
          correcta: true,
        },
        {
          respuesta: '1820',
          correcta: false,
        },
      ],
      aclaracion: 'La batalla de Trafalgar, también conocida como el combate de Trafalgar,3​ fue una batalla naval que tuvo lugar el 21 de octubre de 1805, en el marco de la tercera coalición iniciada por Reino Unido, Austria, Rusia, Nápoles y Suecia para intentar derrocar a Napoleón Bonaparte del trono imperial y disolver la influencia militar francesa existente en Europa.',
    },
    {
      id: 2,
      categoria: '1',
      enunciado: '¿Sabrías decirme el año en el que se produjo la derrota de la armada invencible?',
      respuestas: [
        {
          respuesta: '1610',
          correcta: false,
        },
        {
          respuesta: '1570',
          correcta: false,
        },
        {
          respuesta: '1588',
          correcta: true,
        },
      ],
      aclaracion: ' Armada Invencible, fue una expedición militar marítima que, tras el triunfo en la Batalla de Lepanto y la consolidación del poder español en Europa, fue planificada por el monarca español Felipe II para destronar a Isabel I e invadir Inglaterra.',
    },
    {
      id: 3,
      categoria: '2',
      enunciado: '¿Cuándo se creó el Banco de España?',
      respuestas: [
        {
          respuesta: '1730',
          correcta: false,
        },
        {
          respuesta: '1856',
          correcta: true,
        },
        {
          respuesta: '1900',
          correcta: false,
        },
      ],
      aclaracion: 'Su sede principal, construida entre 1884 y 1891, está situada en la confluencia de la calle Alcalá con el paseo del Prado, con vistas a la plaza de Cibeles.',
    },
    {
      id: 4,
      categoria: '2',
      enunciado: '¿En qué año se inició la primera repúblca en España?',
      respuestas: [
        {
          respuesta: '1865',
          correcta: false,
        },
        {
          respuesta: '1873',
          correcta: true,
        },
        {
          respuesta: '1885',
          correcta: false,
        },
      ],
      aclaracion: 'La Primera República se enmarca dentro del Sexenio Democrático, que comienza con la Revolución de 1868 que dio paso al reinado de Amadeo I de Saboya, al que siguió la república, y termina con el pronunciamiento de Martínez Campos en Sagunto.',
    },
    {
      id: 5,
      categoria: '3',
      enunciado: '¿Sabrías decirme el año de comienzo de la primera guerra mundial?',
      respuestas: [
        {
          respuesta: '1912',
          correcta: false,
        },
        {
          respuesta: '1914',
          correcta: true,
        },
        {
          respuesta: '1913',
          correcta: false,
        },
      ],
      aclaracion: 'Tras seis meses de negociaciones en la Conferencia de Paz de París, el 28 de junio de 1919 los países aliados firmaron el Tratado de Versalles con Alemania, y otros a lo largo del siguiente año con cada una de las potencias derrotadas',
    },
    {
      id: 5,
      categoria: '3',
      enunciado: '¿Te acuerdas de en qué año se produjo la coronación de Juan Carlos primero?',
      respuestas: [
        {
          respuesta: '1985',
          correcta: false,
        },
        {
          respuesta: '1972',
          correcta: true,
        },
        {
          respuesta: '1975',
          correcta: false,
        },
      ],
      aclaracion: 'La Constitución española, ratificada por referéndum popular el 6 de diciembre de 1978 y promulgada el 27 de diciembre del mismo año, reconoció explícitamente su persona como rey de España y legítimo heredero de la dinastía histórica de Borbón',
    }
  ],
};

module.exports = data;
