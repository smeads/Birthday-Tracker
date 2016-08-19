var APP_ID = undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var https = require('https');

var AlexaSkill = require('./AlexaSkill');

var urlPrefix = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&explaintext=&exsectionformat=plain&redirects=&titles=';

var paginationSize = 3;

var delimiterSize = 2;

/**
 * SnowGiddySkill is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var SnowGiddySkill = function() {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
SnowGiddySkill.prototype = Object.create(AlexaSkill.prototype);
SnowGiddySkill.prototype.constructor = SnowGiddySkill;

SnowGiddySkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("SnowGiddySkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session init logic would go here
};

SnowGiddySkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("SnowGiddySkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    getWelcomeResponse(response);
};

SnowGiddySkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session cleanup logic would go here
};

SnowGiddySkill.prototype.intentHandlers = {

    "GetFirstEventIntent": function (intent, session, response) {
        handleFirstEventRequest(intent, session, response);
    },

    "GetNextEventIntent": function (intent, session, response) {
        handleNextEventRequest(intent, session, response);
    },

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
        handleSendFullReportRequest(intent, session, response);
    },

    "SendFiveDayForecastIntent": function (intent, session, response) {
        handleSendFiveDayForecastRequest(intent, session, response);
    },

    "SendContactInfoIntent": function (intent, session, response) {
        handleSendContactInfoRequest(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "With Snow Giddy, you can get real time snow reports and resort information for ski resorts throughout the world." +
            "For example, you could say any resort, or you can say exit. Now, which resort do you want?";
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
                speech: "Thanks for using Snow Giddy, peace out.",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Thanks for using Snow Giddy, have fun shredding the slopes.",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    }
};

/**
 * Function to handle the onLaunch skill behavior
 */

function getWelcomeResponse(response) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var cardTitle = "Snow Giddy";
    var repromptText = "With Snow Giddy, you can get real time snow reports and resort information for ski resorts throughout the world." +
        "For example, you could say any resort, or you can say exit. Now, which resort do you want?";
    var speechText = "<p>Snow giddy.</p> <p>What resort do you want information for?</p>";
    var cardOutput = "Snow Giddy. What resort do you want information for?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.

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

/**
 * Gets a poster prepares the speech to reply to the user.
 */
function handleFirstEventRequest(intent, session, response) {
    var daySlot = intent.slots.day;
    var repromptText = "With History Buff, you can get historical events for any day of the year. For example, you could say today, or August thirtieth. Now, which day do you want?";
    var monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"
    ];
    var sessionAttributes = {};
    // Read the first 3 events, then set the count to 3
    sessionAttributes.index = paginationSize;
    var date = "";

    // If the user provides a date, then use that, otherwise use today
    // The date is in server time, not in the user's time zone. So "today" for the user may actually be tomorrow
    if (daySlot && daySlot.value) {
        date = new Date(daySlot.value);
    } else {
        date = new Date();
    }

    var prefixContent = "<p>For " + monthNames[date.getMonth()] + " " + date.getDate() + ", </p>";
    var cardContent = "For " + monthNames[date.getMonth()] + " " + date.getDate() + ", ";

    var cardTitle = "Events on " + monthNames[date.getMonth()] + " " + date.getDate();

    getJsonEventsFromWikipedia(monthNames[date.getMonth()], date.getDate(), function (events) {
        var speechText = "",
            i;
        sessionAttributes.text = events;
        session.attributes = sessionAttributes;
        if (events.length == 0) {
            speechText = "There is a problem connecting to Wikipedia at this time. Please try again later.";
            cardContent = speechText;
            response.tell(speechText);
        } else {
            for (i = 0; i < paginationSize; i++) {
                cardContent = cardContent + events[i] + " ";
                speechText = "<p>" + speechText + events[i] + "</p> ";
            }
            speechText = speechText + "<p>Wanna go deeper in history?</p>";
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

function handleFullReportRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the full report for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleTwentyFourHourSnowRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the twenty four hour snow report for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleSeventyTwoHourSnowRequest(intent,session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the seventy two hour snow report for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleFiveDayForecastRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the five day forecast for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleBaseDepthRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the base depth for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleSummitDepthRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the summit depth for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleWeatherRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the weather report for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleAvalancheReportRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the avalanche report for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleVisibilityRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the visibility report for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleSnowConditionRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the snow condition for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleResortStatusRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the resort status for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleOperatingLiftsRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here are the operating lifts for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleElevationRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the elevation for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleResortOverviewRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the resort overview for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleTerrainOverviewRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the terrain overview for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleContactInfoRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the contact info for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleLiftTicketPriceRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "Here is the lift ticket prices for Alta.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleSendFullReportRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "I sent a full report for Alta to your mobile device.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleSendFiveDayForecastRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "I sent a five day forecast for Alta to your mobile device.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
}

function handleSendContactInfoRequest(intent, session, response) {
  var resortNameSlot = intent.slots.resortName;
  var speechOutput = {
          speech: "I sent contact info for Alta to your mobile device.",
          type: AlexaSkill.speechOutputType.PLAIN_TEXT
  };
  response.tell(speechOutput);
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
    // Create an instance of the SnowGiddy Skill.
    var skill = new SnowGiddySkill();
    skill.execute(event, context);
};
