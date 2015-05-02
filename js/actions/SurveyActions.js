var Reflux = require('reflux');

var SurveyActions = Reflux.createActions([
    "load",                         // initial data load
    "blockDropped",                 // when block is dropped
    "questionDropped",              // when question is dropped
    "optionDropped",                // when option is dropped
    "toggleModal",                  // when a modal is toggled
    "showAlert",                    // when the alert box needs to be shown
    "downloadSurvey",               // when a survey download is requested
    "toggleParam",                  // when a config param is toggled for any type
    "itemDelete",                   // when an item (option/question/block) is called to be deleted
    "saveEditText"                  // when question text is changed
]);

module.exports = SurveyActions;
