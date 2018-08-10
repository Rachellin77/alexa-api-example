const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const https = require('https');
const dateformat = require('dateformat');

// 1. Handlers ===================================================================================

const LaunchHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const requestAttributes = attributesManager.getRequestAttributes();
        //const speechOutput = `${requestAttributes.t('WELCOME')} ${requestAttributes.t('HELP')}`;
        const speechOutput = `${requestAttributes.t('WELCOME')} ${requestAttributes.t('HELP')}`;
        return responseBuilder
            .speak(speechOutput)
            .reprompt(speechOutput)
            .getResponse();
    },
};

const AboutHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'AboutIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const requestAttributes = attributesManager.getRequestAttributes();

        return responseBuilder
            .speak(requestAttributes.t('ABOUT'))
            .getResponse();
    },
};



const YesHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const sessionAttributes = attributesManager.getSessionAttributes();
        const yourstarsign = sessionAttributes.yoursign;
     
        if (yourstarsign.toLowerCase()  == "aquarius")
            yourstarsign = "aquarian";
        if (yourstarsign.toLowerCase()  == "sagittarian")
            yourstarsign = "sagittarius";
        if (yourstarsign.toLowerCase()  == "librae")
            yourstarsign = "libra";
            
            
        const myURL = {
                host: 'horoscope-api.herokuapp.com',
                path: 'horoscope/today/' + yourstarsign,
                method: 'GET',
            };
        var returnData = '';
        var speechOutput = '';
        var byeword = randomArrayElement(data.goodByGreetings);
        return new Promise((resolve) => {
                            const req = https.request(myURL, (res) => {
                            res.setEncoding('utf8');
                                  
                            res.on('data', (chunk) => {
                                returnData += chunk;
                                
                            });
                            res.on('end', () => {
                                //let todayDate = new Date(JSON.parse(returnData).date);
                                var now = new Date();
                                let todayDate = dateformat(now,"d-m");
                           
                                let todayHoro = JSON.parse(returnData).horoscope;
                                speechOutput =  yourstarsign + ' <break time="1s"/> :'  + todayHoro + ', that is all for today,' + byeword.greetingword;
                                var card = todayHoro;

                                resolve(handlerInput.responseBuilder.speak(speechOutput).withSimpleCard(SKILL_NAME + ' : ' + yourstarsign, card).getResponse());
                             
                            });
                        });
                        req.end();
                        
                         
                         });
                        

         
    },
};

const StarSignHandler = { //rachel
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'StarSignIntent';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;

        var birthdayGreeting = '';

        // (request.intent.slots.birthdate.value) {
            var birthday = request.intent.slots.birthdate.value;
        //}
        
        const yoursign = getStarSignByDate(birthday);
         
         
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes();

        var now = new Date();
        var todayDate = dateformat(now,"d-mmm"); //get today date 
        var todayBirthday = dateformat(birthday,"d-mmm"); 
        
        if (todayDate == todayBirthday) 
            birthdayGreeting = 'hey, today is your birthday, happy birthday,';

        const speechOutput = birthdayGreeting + ' your star sign is ' +  yoursign  + ', would you like to hear more?' ;
        
        sessionAttributes.yoursign = yoursign;
        return responseBuilder.speak(speechOutput).reprompt(speechOutput).getResponse();
    },
};

const TodayHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        //const mysign = request.intent.slots.distance.value;
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        console.log(attributes);
        return request.type === 'IntentRequest' && request.intent.name === 'TodayIntent';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        var speechOutput = '';
        let mysign = request.intent.slots.mystarsign.value;
        console.log(mysign); 
        var returnData = '';
        
          if (mysign.toLowerCase()  == "aquarius")
            mysign = "aquarian";
        if (mysign.toLowerCase()  == "sagittarian")
            mysign = "sagittarius";
        if (mysign.toLowerCase()  == "librae")
            mysign = "libra";
            
        
      
       const myURL = {
                host: 'horoscope-api.herokuapp.com',
                path: 'horoscope/today/' + mysign,
                method: 'GET',
            };
        var byeword = randomArrayElement(data.goodByGreetings);
       // console.log(byeword.greetingword);
        return new Promise((resolve) => {
                            const req = https.request(myURL, (res) => {
                            res.setEncoding('utf8');
                                  
                            res.on('data', (chunk) => {
                                returnData += chunk;
                                
                            });
                            res.on('end', () => {
                                //let todayDate = JSON.parse(returnData).date;
                                var now = new Date();
                                let todayDate = dateformat(now,"d-m");
                                console.log(returnData); 
                                let todayHoro = JSON.parse(returnData).horoscope;
                                speechOutput =  mysign + '<break time="1s"/> :'  + todayHoro + ',that\'s all for today, ' + byeword.greetingword;
                                
                                const card = todayHoro;

                               
                                resolve(handlerInput.responseBuilder.speak(speechOutput).withSimpleCard(SKILL_NAME + ' : ' + mysign, card).getResponse());

                                //console.log(speechOutput);
                                //resolve(handlerInput.responseBuilder.speak(speechOutput).getResponse());
                             
                            });
                        });
                        req.end();
                        
                         
                         });

    },
};

const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const requestAttributes = attributesManager.getRequestAttributes();
        return responseBuilder
            .speak(requestAttributes.t('HELP'))
            .reprompt(requestAttributes.t('HELP'))
            .getResponse();
    },
};

const StopHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.NoIntent'
            || request.intent.name === 'AMAZON.CancelIntent'
            || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const responseBuilder = handlerInput.responseBuilder;

        const requestAttributes = attributesManager.getRequestAttributes();
        return responseBuilder
            .speak(requestAttributes.t('STOP'))
            .getResponse();
    },
};

const SessionEndedHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const request = handlerInput.requestEnvelope.request;

        console.log(`Error handled: ${error.message}`);
        console.log(` Original request was ${JSON.stringify(request, null, 2)}\n`);

        return handlerInput.responseBuilder
            .speak('Sorry, I can\'t understand the command. Please say again.')
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};

// 2. Constants ==================================================================================

const languageStrings = {
    en: {
        translation: {
            WELCOME: 'Good day!',
            //WELCOME:  `<say-as interpret-as="interjection">g'day</say-as>`;
            HELP: 'Say your star sign  or your birthday to start',
            ABOUT: `Star sign is to let you know your today's luck.`,
            STOP: 'Okay, see you next time!',
        },
    },
    // , 'de-DE': { 'translation' : { 'TITLE'   : "Local Helfer etc." } }
};

function randomArrayElement(array) {
    let i = 0;
    i = Math.floor(Math.random() * array.length);
    return (array[i]);
}
const data = {
    goodByGreetings: [
        {
            greetingword: "have a lovely day",
        },
         {
            greetingword: "talk to you later",
        },
        {
            greetingword: "Have a good one",
        },
        {
            greetingword: "cheers",
        },
        {
            greetingword: "chao",
        },
         {
            greetingword: "Hoo roo",
        },
        {
            greetingword: "Have a good one",
        },
        
        ],
     horoscope: [
        {
            datebegin: '01-20',
            dateend:'02-18',
            starsign: 'Aquarius',
            
        },
        {
            datebegin: '2-19',
            dateend:'3-20',
            starsign: 'pisces',
           
        },
        {
            datebegin: '3-21',
            dateend:'4-19',
            starsign: 'aries',
           
        },
        {
            datebegin: '4-20',
            dateend:'5-20',
            starsign: 'Taurus',
           
        },
        {
            datebegin: '5-21',
            dateend:'6-20',
            starsign: 'Gemini',
           
        },
        {
            datebegin: '6-21',
            dateend:'7-22',
            starsign: 'Cancer',
           
        },
        {
            datebegin: '7-23',
            dateend:'8-22',
            starsign: 'leo',
           
        },
        {
            datebegin: '8-23',
            dateend:'9-22',
            starsign: 'virgo',
           
        },
        {
            datebegin: '09-23',
            dateend:'10-22',
            starsign: 'libra',
           
        },
        {
            datebegin: '10-23',
            dateend:'11-21',
            starsign: 'scorpio',
           
        },
        {
            datebegin: '11-22',
            dateend:'12-21',
            starsign: 'Sagittarius',
           
        },
        {
            datebegin: '12-22',
            dateend:'1-19',
            starsign: 'Capricorn',
           
        }
       
    ]
};

const SKILL_NAME = 'YOUR STAR SIGN';


// 3. Helper Functions ==========================================================================


function getStarSignByDate(yourbirthday) {
    var list = '';
    console.log(yourbirthday);

    for (let i = 0; i < data.horoscope.length; i += 1) {
         var starDate = new Date(data.horoscope[i].datebegin);
         var newdate = new Date(starDate);
         var datanewdate = dateformat(newdate,"mm-d");
         
         var newBirthdaydate = new Date(yourbirthday);
         
         var mynewdate = dateformat(newBirthdaydate,"mm-d");
      
       
         if (mynewdate >= datanewdate) {
           
            var endDate = new Date(data.horoscope[i].dateend);
            var datanewenddate = dateformat(endDate,"mm-d");
            if (mynewdate <= datanewenddate) {
         
                list = data.horoscope[i].starsign;
          
            }
        }
        else{
        //    console.log('smaller');
        }
    }
     
    return list;
}

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true,
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        };
    },
};


// 4. Export =====================================================================================

const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchHandler,
        AboutHandler,
        YesHandler,
        StarSignHandler,
        TodayHandler,
        HelpHandler,
        StopHandler,
        SessionEndedHandler
    )
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .lambda();
