var Reflux = require('reflux');

var SurveyActions = Reflux.createActions([
    "load",                         // initial data load
    "blockDropped",                 // when block is dropped
    "questionDropped",              // when question is dropped
    "optionAdded",                  // when option is added
    "toggleModal",                  // when a modal is toggled
    "showAlert",                    // when the alert box needs to be shown
    "downloadSurvey",               // when a survey download is requested
    "toggleParam",                  // when a config param is toggled for any type
    "itemDelete",                   // when an item (option/question/block) is called to be deleted
    "itemCopy",                     // when an item (question/block) is called to be copied
    "saveEditText",                 // when question text is changed
    "undoSurvey",                   // when the undo button is clicked
    "scrollToItem"                  // when an item needs to be scrolled to
]);

module.exports = SurveyActions;
