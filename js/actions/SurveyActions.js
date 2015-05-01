var Reflux = require('reflux');

var SurveyActions = Reflux.createActions([
    "load",                         // initial data load
    "blockDropped",                 // when block is dropped
    "questionDropped",              // when question is dropped
    "optionDropped",                // when option is dropped
    "toggleModal",                  // when a modal is toggled
    "showAlert",                    // when the alert box needs to be shown
    "downloadSurvey",               // when a survey download is requested
    "toggleParam"                   // when a config param is toggled for any type
]);

module.exports = SurveyActions;
