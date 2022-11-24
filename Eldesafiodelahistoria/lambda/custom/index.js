/* eslint-disable  no-console */
/* eslint-disable global-require */
const Alexa = require('ask-sdk-core');
const AplTemplates = require('./apl/aplTemplates');
const SessionState = require('./data/sessionState');

const GlobalHandlers = require('./handlers/globalHandlers'); // ErrorHandler, SessionEnded...
const AplUserEventHandler = require('./handlers/aplUserEventHandler');

const preguntas = require('./data/preguntas-trivial');

function capitalizeFirstLetter(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function preguntaToString(pregunta) {
  let ret = `${capitalizeFirstLetter(pregunta.enunciado)} `;
  for (let i = 0; i < pregunta.respuestas.length; i += 1) {
    ret += `${String.fromCharCode('A'.charCodeAt() + i)}: ${capitalizeFirstLetter(pregunta.respuestas[i].respuesta)}. <break time="1s"/>`;
  }
  ret += ' ¿Qué letra eliges?';
  return ret;
}

function respuestasToArray(pregunta) {
  var options = ["test","test","test3"];
  for (let i = 0; i < pregunta.respuestas.length; i += 1) {
    options[i] = pregunta.respuestas[i].respuesta;
  }
  return options;
}

function getRandomItem(arrayOfItems) {
  let i = 0;
  i = Math.floor(Math.random() * arrayOfItems.length);
  return (arrayOfItems[i]);
}

function getCategoriaName(pregunta){
  const catName = preguntas.CATEGORIAS.filter(one => one.id === pregunta.categoria)[0].nombre;
  let speechText = `${catName}.`;
  return speechText;
}

function getRandomQuestionAndSave(handlerInput){
  const oneQuestion = getRandomItem(preguntas.PREGUNTAS);
  SessionState.setCurrentQuestion(handlerInput, oneQuestion);
  return oneQuestion;
}

function getCorrectLetter(q) {
  let i = 0;
  for (const one of q.respuestas) { // eslint-disable-line no-restricted-syntax
    if (one.correcta === true) {
      return String.fromCharCode('A'.charCodeAt() + i);
    }
    i += 1;
  }
  return null; // caso imposible. Todas las preguntas tienen una opción correcta.
}

function simpleApl(handlerInput, speechText) {
  return AplTemplates.getAplTextAndHintOrVoice(handlerInput, handlerInput.t.SKILL_NAME,
    speechText, handlerInput.t.HINT_HOME, speechText);
}

function questionApl(handlerInput, speechText) {
  const question = getRandomQuestionAndSave(handlerInput)
  const categoryName = getCategoriaName(question)
  speechText += `Pregunta ${categoryName}. `;
  speechText += preguntaToString(question);

  return AplTemplates.getAplQuestion(handlerInput,question.enunciado,`Pregunta ${categoryName}`,respuestasToArray(question),speechText);
}

function titleApl(handlerInput, speechText) {
  return AplTemplates.getAplTitle(handlerInput,handlerInput.t.SKILL_NAME,handlerInput.t.WELCOME_TO,handlerInput.t.DI_JUGAR,speechText)
}


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    SessionState.setCurrentState(handlerInput, SessionState.STATES.LAUNCH);

    return titleApl(handlerInput, `${handlerInput.t.WELCOME_TO}. ${handlerInput.t.HELP}`);
  },
};


const JugarIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'JugarIntent';
  },
  async handle(handlerInput) {
    SessionState.setCurrentState(handlerInput, SessionState.STATES.PLAYING);
    let speechText = '¡Jugamos! ';

    return questionApl(handlerInput, speechText);
  },
};


const NextIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NextIntent';
  },
  handle(handlerInput) {
    SessionState.setCurrentState(handlerInput, SessionState.STATES.PLAYING);
    let speechText = 'Ok, pasamos a la siguiente pregunta. ';

    return questionApl(handlerInput, speechText);
  },
};


const RespuestaIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RespuestaIntent';
  },
  handle(handlerInput) {
    let speech = '';
    const lastQuestion = SessionState.getCurrentQuestion(handlerInput);
    if (!lastQuestion) {
      speech = `Uy qué raro, creo que no te he preguntado nada aún. ${handlerInput.t.DI_JUGAR}`;
      return simpleApl(handlerInput, speech);
    }

    SessionState.setCurrentState(handlerInput, SessionState.STATES.PLAYING);

    const itemSlot = handlerInput.requestEnvelope.request.intent.slots.respuesta;
    let itemNameMatched = null; // lo que matchea con la respuesta dada por el usuario (A, B, C...).

    if (itemSlot && itemSlot.resolutions
      && itemSlot.resolutions.resolutionsPerAuthority
      && itemSlot.resolutions.resolutionsPerAuthority[0].values
      && itemSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name
    ) {
      /* Guardamos la opción elegida por el usuario (A, B, C...); no lo que ha pronunciado.
      Es decir, sí ha pronunciado "be" lo que nos guardamos es "B".
      Esto lo podemos hacer porque a la hora de crear el modelo, hemos definido "be"
      como sinónimo de "B".
        */
      itemNameMatched = itemSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } else {
      // caso posible si no hay match.
      return simpleApl(handlerInput, 'No te he entendido, repite por favor.');
    }

    if (itemNameMatched === getCorrectLetter(lastQuestion)) {
      speech = '¡Correcto!';
    } else {
      speech = '¡Error!';
    }
    speech += ` ${capitalizeFirstLetter(lastQuestion.aclaracion)} <break time="2s"/>`;
    speech += ' Siguiente pregunta. ';

    speech += getRandomQuestionSpeechAndSave(handlerInput);

    return simpleApl(handlerInput, speech);
  },
};


const RepeatIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent';
  },
  handle(handlerInput) {
    let speech = '';
    let lastQuestion = null;
    const status = SessionState.getCurrentState(handlerInput);
    switch (status) {
      case SessionState.STATES.LAUNCH:
        return simpleApl(handlerInput, `${handlerInput.t.WELCOME_TO}. ${handlerInput.t.HELP}`);
      case SessionState.STATES.HELP:
        return simpleApl(handlerInput, handlerInput.t.HELP);
      case SessionState.STATES.PLAYING:
        lastQuestion = SessionState.getCurrentQuestion(handlerInput);
        if (!lastQuestion) {
          speech = `Uy qué raro, he olvidado la pregunta. ${handlerInput.t.DI_JUGAR}`; // caso imposible
        } else {
          speech = `Repito la pregunta: ${preguntaToString(lastQuestion)}`;
        }
        return simpleApl(handlerInput, speech);
      default:
        return simpleApl(handlerInput, `No tengo nada que repetir. ${handlerInput.t.DI_JUGAR}`); // caso imposible
    }
  },
};


const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    SessionState.setCurrentState(handlerInput, SessionState.STATES.HELP);

    return simpleApl(handlerInput, handlerInput.t.HELP);
  },
};


// Initialize 'handlerInput.t' with user language or default language.
const myLocalizationInterceptor = {
  process(handlerInput) {
    // const langUser = handlerInput.requestEnvelope.request.locale;
    handlerInput.t = require('./strings/es'); // eslint-disable-line import/no-dynamic-require, no-param-reassign
  },
};


const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    JugarIntentHandler,
    HelpIntentHandler,
    NextIntentHandler,
    RepeatIntentHandler,
    RespuestaIntentHandler,

    AplUserEventHandler.EventHandler, // taps en pantalla APL (ver APL list en HelpIntentHandler)

    GlobalHandlers.CancelAndStopIntentHandler,
    GlobalHandlers.FallbackIntentHandler, // to Respond Gracefully to Unexpected Customer Requests
    GlobalHandlers.SessionEndedRequestHandler,
    GlobalHandlers.IntentReflectorHandler, // last
  )
  .addRequestInterceptors(myLocalizationInterceptor) // lang
  .addErrorHandlers(GlobalHandlers.ErrorHandler)
  // .withApiClient(new Alexa.DefaultApiClient()) // API to get user permissions & ISP
  .lambda();
