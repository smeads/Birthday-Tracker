var APP_ID = undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';
var https = require('https');
var AlexaSkill = require('./AlexaSkill');
/**
 * URL prefix to download skir resort content from OnTheSnow.com
 */
var urlPrefix = ''
/**
 * SnowGiddy is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var SnowGiddy = function() {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
SnowGiddy.prototype = Object.create(AlexaSkill.prototype);
SnowGiddy.prototype.constructor = SnowGiddy;

SnowGiddy.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("SnowGiddy onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session init logic would go here
};

SnowGiddy.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("SnowGiddy onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    getWelcomeResponse(response);
};

SnowGiddy.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session cleanup logic would go here
};

SnowGiddy.prototype.intentHandlers = {

    "GetFullReportIntent": function (intent, session, response) {
        handleFullReportRequest(intent, session, response);
    },

    "GetTwentyFourHourSnowIntent": function (intent, session, response) {
        handleTwentyFourHourSnowRequest(intent, session, response);
    },

    "GetSeventyTwoHourSnowIntent": function (intent, session, response) {
        handleSeventyTwoHourSnowRequest(intent, session, response);
    },

    "GetFiveDayForecastIntent": function (intent, session, response) {
        handleFiveDayForecastRequest(intent, session, response);
    },

    "GetBaseDepthIntent": function (intent, session, response) {
        handleBaseDepthRequest(intent, session, response);
    },

    "GetSummitDepthIntent": function (intent, session, response) {
        handleSummitDepthRequest(intent, session, response);
    },

    "GetWeatherIntent": function (intent, session, response) {
        handleWeatherRequest(intent, session, response);
    },

    "GetAvalancheReportIntent": function (intent, session, response) {
        handleAvalancheReportRequest(intent, session, response);
    },

    "GetVisibilityIntent": function (intent, session, response) {
        handleVisibilityRequest(intent, session, response);
    },

    "GetSnowConditionIntent": function (intent, session, response) {
        handleSnowConditionRequest(intent, session, response);
    },

    "GetResortStatusIntent": function (intent, session, response) {
        handleResortStatusRequest(intent, session, response);
    },

    "GetOperatingLiftsIntent": function (intent, session, response) {
        handleOperatingLiftsRequest(intent, session, response);
    },

    "GetElevationIntent": function (intent, session, response) {
        handleElevationRequest(intent, session, response);
    },

    "GetResortOverviewIntent": function (intent, session, response) {
        handleResortOverviewRequest(intent, session, response);
    },

    "GetTerrainOverviewIntent": function (intent, session, response) {
        handleTerrainOverviewRequest(intent, session, response);
    },

    "GetContactInfoIntent": function (intent, session, response) {
        handleContactInfoRequest(intent, session, response);
    },

    "GetLiftTicketPriceIntent": function (intent, session, response) {
        handleLiftTicketPriceRequest(intent, session, response);
    },

    "SendFullReportIntent": function (intent, session, response) {
        handleFullReportRequest(intent, session, response);
    },

    "SendFiveDayForecastIntent": function (intent, session, response) {
        handleFiveDayForecastRequest(intent, session, response);
    },

    "SendContactInfoIntent": function (intent, session, response) {
        handleContactInfoRequest(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "With Snow Giddy, you can get snow updates and much more for any ski resort." +
            "For example, you could say Sundance Mountain Resort full report, or Sundance Mountain Resort five day forecast, or you can say exit. Now, which resort do you want?";
        var repromptText = "Which resort do you want?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Thank you for using Snow Giddy, enjoy the snow.",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Thank you for using Snow Giddy, have fun shredding.",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
  },

  "AMAZON.RepeatIntent": function (intent, session, response) {
      var speechOutput = {
              speech: ""
              type: AlexaSkill.speechOutputType.PLAIN_TEXT
      };
      reponse.tell(speechOutput);
  },

  "AMAZON.StartOverIntent": function (intent, session, response) {
      var speechOutput = {
              speech: ""
              type: AlexaSkill.speechOutputType.PLAIN_TEXT
      };
      response.tell(speechOutput);
  },
};

function getWelcomeResponse(response) {
    var cardTitle = "Snow Giddy";
    var repromptText = "With Snow Giddy, you can get snow updates and much more for any ski resort. For example, you could say Sundance Mountain full report, or Sundance Mountain five day forecast, or you can say exit. Now, which resort do you want?";
    var speechText = "<p>Snow Giddy.</p> <p>What resort do you want information for?</p>";
    var cardOutput = "Snow Giddy. What resort do you want information for?";
    var speechOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, cardTitle, cardOutput);
}

function handleFullReportRequest(intent, session, response) {
    var resortSlot = intent.slots.resortName;
    var repromptText = "With Snow Giddy, you can get snow updates and more for any ski resort. For example, you could say Sundance Mountain full report, or Sundance Mountain five day forecast, or you can say exit. Now, which resort do you want?";
    var resortNames = ["Alta", "Brighton", "Snowbird", "Solitude", "Park City", "Canyons", "Sundance", "Sun Valley", "Brian Head", "Bear Mountain", "Mammoth"
    ];
    var sessionAttributes = {};
    sessionAttributes.index = paginationSize;
    var resort = "";

    if (resortSlot && resortSlot.value) {
        resort = new Resort(resortSlot.value);
    } else {
        resort = new Resort();
    }

    var prefixContent = "<p>For " + resortNames[resort.getResort()] + " " + resort.getResort() + ", </p>";
    var cardContent = "For " + resortNames[resort.getResort()] + " " + resort.getResort() + ", ";

    var cardTitle = "Full report for " + resortNames[resort.getResort()] + " " + resort.getResort();

    getJsonFullReportFromOnTheSnow(resortNames[resort.getResort()], resort.getResort(), function (full_report) {
        var speechText = "",
            i;
        sessionAttributes.text = full_report;
        session.attributes = sessionAttributes;
        if (full_report.length == 0) {
            speechText = "There is a problem connecting to On The Snow at this time. Please try again later.";
            cardContent = speechText;
            response.tell(speechText);
        } else {
            for (i = 0; i < paginationSize; i++) {
                cardContent = cardContent + full_report[i] + " ";
                speechText = "<p>" + speechText + full_report[i] + "</p> ";
            }
            speechText = speechText + "<p>Do you want additional resort information?</p>";
            var speechOutput = {
                speech: "<speak>" + prefixContent + speechText + "</speak>",
                type: AlexaSkill.speechOutputType.SSML
            };
            var repromptOutput = {
                speech: repromptText,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
        }
    });
}

/**
 * Gets a poster prepares the speech to reply to the user.
 */
function handleNextEventRequest(intent, session, response) {
    var cardTitle = "More events on this day in history",
        sessionAttributes = session.attributes,
        result = sessionAttributes.text,
        speechText = "",
        cardContent = "",
        repromptText = "Do you want to know more about what happened on this date?",
        i;
    if (!result) {
        speechText = "With History Buff, you can get historical events for any day of the year. For example, you could say today, or August thirtieth. Now, which day do you want?";
        cardContent = speechText;
    } else if (sessionAttributes.index >= result.length) {
        speechText = "There are no more events for this date. Try another date by saying <break time = \"0.3s\"/> get events for august thirtieth.";
        cardContent = "There are no more events for this date. Try another date by saying, get events for august thirtieth.";
    } else {
        for (i = 0; i < paginationSize; i++) {
            if (sessionAttributes.index>= result.length) {
                break;
            }
            speechText = speechText + "<p>" + result[sessionAttributes.index] + "</p> ";
            cardContent = cardContent + result[sessionAttributes.index] + " ";
            sessionAttributes.index++;
        }
        if (sessionAttributes.index < result.length) {
            speechText = speechText + " Wanna go deeper in history?";
            cardContent = cardContent + " Wanna go deeper in history?";
        }
    }
    var speechOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
}

function getJsonEventsFromWikipedia(day, date, eventCallback) {
    var url = urlPrefix + day + '_' + date;

    https.get(url, function(res) {
        var body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var stringResult = parseJson(body);
            eventCallback(stringResult);
        });
    }).on('error', function (e) {
        console.log("Got error: ", e);
    });
}

function parseJson(inputText) {
    // sizeOf (/nEvents/n) is 10
    var text = inputText.substring(inputText.indexOf("\\nEvents\\n")+10, inputText.indexOf("\\n\\n\\nBirths")),
        retArr = [],
        retString = "",
        endIndex,
        startIndex = 0;

    if (text.length == 0) {
        return retArr;
    }

    while(true) {
        endIndex = text.indexOf("\\n", startIndex+delimiterSize);
        var eventText = (endIndex == -1 ? text.substring(startIndex) : text.substring(startIndex, endIndex));
        // replace dashes returned in text from Wikipedia's API
        eventText = eventText.replace(/\\u2013\s*/g, '');
        // add comma after year so Alexa pauses before continuing with the sentence
        eventText = eventText.replace(/(^\d+)/,'$1,');
        eventText = 'In ' + eventText;
        startIndex = endIndex+delimiterSize;
        retArr.push(eventText);
        if (endIndex == -1) {
            break;
        }
    }
    if (retString != "") {
        retArr.push(retString);
    }
    retArr.reverse();
    return retArr;
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HistoryBuff Skill.
    var skill = new SnowGiddy();
    skill.execute(event, context);
};
