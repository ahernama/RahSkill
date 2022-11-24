module.exports = {
  
  getAplMessage(handlerInput, message, helpmessage, speechText) {
    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
      /* si hay soporte APL... */
      const docu = require('./documentMessage.json'); 
      const d = require('./myDataSourceMessage.json'); 

      d.headlineTemplateData.properties.textContent.primaryText.text = message;
      d.headlineTemplateData.properties.hintText = helpmessage;
      
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

  getAplTitle(handlerInput, titleSkill, descSkill, nextStep, speechText, answer, urlImage) {
    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
      /* si hay soporte APL... */
      const docu = require('./documentTitle.json'); 
      const d = require('./myDataSourceTitle.json'); 

      d.simpleTextTemplateData.properties.titleText = titleSkill;
      d.simpleTextTemplateData.properties.primaryText = descSkill;
      d.simpleTextTemplateData.properties.hintText = nextStep;

      if (answer){
        d.simpleTextTemplateData.properties.foregroundImageLocation = "top";
        d.simpleTextTemplateData.properties.foregroundImageSource = urlImage;
      }else{
        d.simpleTextTemplateData.properties.foregroundImageLocation = "left";
      }
      
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
  }
};
