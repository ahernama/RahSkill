/* eslint-disable  no-console */
/* eslint-disable global-require */
const Alexa = require('ask-sdk-core');
const AplTemplates = require('./apl/aplTemplates');
const SessionState = require('./data/sessionState');

const GlobalHandlers = require('./handlers/globalHandlers'); // ErrorHandler, SessionEnded...
const AplUserEventHandler = require('./handlers/aplUserEventHandler');

const preguntas = require('./data/preguntas-trivial');
const sfx = require('./data/sfx');

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

function getCorrectAnswer(q) {
  let i = 0;
  for (const one of q.respuestas) { // eslint-disable-line no-restricted-syntax
    if (one.correcta === true) {
      return one.respuesta
    }
    i += 1;
  }
  return null; // caso imposible. Todas las preguntas tienen una opción correcta.
}

function messageApl(handlerInput, speechText) {
  return AplTemplates.getAplMessage(handlerInput,speechText,handlerInput.t.HINT_HOME,speechText)
}

function questionApl(handlerInput, speechText) {
  const question = getRandomQuestionAndSave(handlerInput)
  return questionAplWithQuestion(handlerInput,speechText,question);
}

function questionAplWithQuestion(handlerInput, speechText, question) {
  const categoryName = getCategoriaName(question)
  speechText += `Pregunta ${categoryName}. `;
  speechText += preguntaToString(question);

  return AplTemplates.getAplQuestion(handlerInput,question.enunciado,`Pregunta ${categoryName}`,respuestasToArray(question),speechText);
}

function titleApl(handlerInput, speechText) {
  return AplTemplates.getAplTitle(handlerInput,handlerInput.t.SKILL_NAME,handlerInput.t.WELCOME_TO,handlerInput.t.DI_JUGAR,speechText,false,"")
}

function answerApl(handlerInput, speechText,title,desc,help,url) {
  return AplTemplates.getAplTitle(handlerInput,title,desc,help,speechText,true,url)
}


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  async handle(handlerInput) {
    SessionState.setCurrentState(handlerInput, SessionState.STATES.LAUNCH);
    var welcomeTone = sfx.launchTones[Math.floor(Math.random() * sfx.launchTones.length)];
    let launchMessage = `${welcomeTone} ${handlerInput.t.WELCOME_TO}. ${handlerInput.t.HELP}`;
    return titleApl(handlerInput, launchMessage);
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
    
    const lastQuestion = SessionState.getCurrentQuestion(handlerInput);
    if (!lastQuestion) {
      return messageApl(handlerInput,`Uy qué raro, creo que no te he preguntado nada aún. ${handlerInput.t.DI_JUGAR}`);
    }

    SessionState.setCurrentState(handlerInput, SessionState.STATES.PLAYING);

    const itemSlot = handlerInput.requestEnvelope.request.intent.slots.respuesta;
    let itemNameMatched = null; // lo que matchea con la respuesta dada por el usuario (A, B, C...).

    if (itemSlot && itemSlot.resolutions
      && itemSlot.resolutions.resolutionsPerAuthority
      && itemSlot.resolutions.resolutionsPerAuthority[0].values
      && itemSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name
    ) {
      itemNameMatched = itemSlot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    } else {
      return messageApl(handlerInput,'No te he entendido, repite por favor.');
    }

    let titleMessage = '';
    if (itemNameMatched === getCorrectLetter(lastQuestion)) {
      var rightTone = sfx.rightSounds[Math.floor(Math.random() * sfx.rightSounds.length)];
      titleMessage = `${rightTone} ¡Correcto! `;
    } else {
      var wrongTone = sfx.wrongSounds[Math.floor(Math.random() * sfx.wrongSounds.length)];
      titleMessage = `${wrongTone} ¡Error! la respuesta correcta era ${getCorrectAnswer(lastQuestion)}. `;
    }
    let contentMessge = ` ${capitalizeFirstLetter(lastQuestion.aclaracion)} <break time="1s"/>`;

    return answerApl(handlerInput,titleMessage+contentMessge+handlerInput.t.DI_SIGUIENTE,titleMessage,contentMessge,handlerInput.t.DI_SIGUIENTE,lastQuestion.url);
  },
};


const RepeatIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.RepeatIntent';
  },
  handle(handlerInput) {
    let lastQuestion = null;
    const status = SessionState.getCurrentState(handlerInput);
    switch (status) {
      case SessionState.STATES.LAUNCH:
        return messageApl(handlerInput, `${handlerInput.t.WELCOME_TO}. ${handlerInput.t.HELP}`);
      case SessionState.STATES.HELP:
        return messageApl(handlerInput, handlerInput.t.HELP);
      case SessionState.STATES.PLAYING:
        lastQuestion = SessionState.getCurrentQuestion(handlerInput);
        if (!lastQuestion) {
          return messageApl(handlerInput,`Uy qué raro, he olvidado la pregunta. ${handlerInput.t.DI_JUGAR}`);
        }
        return questionAplWithQuestion(handlerInput,'Te repito la pregunta ', lastQuestion);
      default:
        return messageApl(handlerInput,`No tengo nada que repetir. ${handlerInput.t.DI_JUGAR}`);
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

    return messageApl(handlerInput, handlerInput.t.HELP);
  },
};


// Initialize 'handlerInput.t' with user language or default language.
const myLocalizationInterceptor = {
  process(handlerInput) {
    handlerInput.t = require('./strings/es'); 
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
