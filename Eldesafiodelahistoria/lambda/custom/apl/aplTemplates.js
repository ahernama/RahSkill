module.exports = {

  /**
   * Returns a response with APL (if compatible) or just voice response
   * @param {Object} handlerInput
   * @param {string} title
   * @param {string} text
   * @param {string} hint
   * @param {string} speechText
   * @param {string} img Url de la imagen de fondo. Puede ser null.
   * @param {bool} isStop indica si hay que cerrar sesión después (true) o no (false)
   */
  getAplTextAndHintOrVoiceOptionalStop(handlerInput, title, text, hint, speechText, img, isStop) {
    const ret = handlerInput.responseBuilder
      .speak(speechText);

    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
      /* si hay soporte APL... */
      const docu = require('./documentTextAndHint.json'); // eslint-disable-line global-require
      const d = require('./myDataSourceTextAndHint.json'); // eslint-disable-line global-require

      d.data.title = title;
      d.data.text = text;
      d.data.hintText = hint;

      if (img !== null) {
        d.data.backgroundImageSmall = img;
        d.data.backgroundImage = img;
      }

      ret.addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.0',
        document: docu,
        datasources: d,
      });
    } else {
      ret.withSimpleCard(title, speechText)
        .getResponse();
    }

    if (!isStop) {
      ret.reprompt(speechText + hint);
    } else {
      ret.withShouldEndSession(true);
    }

    return ret.getResponse();
  },


  /**
   * Returns a response with APL (if compatible) or just voice response
   * @param {Object} handlerInput
   * @param {string} title
   * @param {string} text
   * @param {string} hint
   * @param {string} speechText
   */
  getAplTextAndHintOrVoice(handlerInput, title, text, hint, speechText) {
    return this.getAplTextAndHintOrVoiceOptionalStop(handlerInput, title, text,
      hint, speechText, null, false);
  },

  getAplTextAndHintAndBackgroundOrVoice(handlerInput, title, text, hint, img, speechText) {
    return this.getAplTextAndHintOrVoiceOptionalStop(handlerInput, title, text,
      hint, speechText, img, false);
  },

  getAplQuestion(handlerInput, question, category, options, speechText) {
    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
      /* si hay soporte APL... */
      const docu = require('./documentQuestion.json'); 
      const d = require('./myDataSourceQuestion.json'); 

      d.multipleChoiceTemplateData.properties.choices = options;
      d.multipleChoiceTemplateData.properties.primaryText = question;
      d.multipleChoiceTemplateData.properties.titleText =  category;

      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .addDirective({
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.0',
          document: docu,
          datasources: d,
        })
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(title, speechText)
      .getResponse();
  },

  getAplTitle(handlerInput, titleSkill, descSkill, nextStep, speechText) {
    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
      /* si hay soporte APL... */
      const docu = require('./documentTitle.json'); 
      const d = require('./myDataSourceTitle.json'); 

      d.simpleTextTemplateData.properties.titleText = titleSkill;
      d.simpleTextTemplateData.properties.primaryText = descSkill;
      d.simpleTextTemplateData.properties.hintText = nextStep;
      
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .addDirective({
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.0',
          document: docu,
          datasources: d,
        })
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(title, speechText)
      .getResponse();
  },
};
