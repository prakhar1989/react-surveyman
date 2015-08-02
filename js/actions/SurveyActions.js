var Reflux = require("reflux");

var SurveyActions = Reflux.createActions([
    "load",                         // initial data load
    "blockDropped",                 // when block is dropped
    "questionDropped",              // when question is dropped
    "optionGroupDropped",           // when optionGroup is dropped
    "optionAdded",                  // when option is added
    "toggleModal",                  // when a modal is toggled
    "showAlert",                    // when the alert box needs to be shown
    "downloadSurvey",               // when a survey download is called
    "saveSurvey",                   // when a survey save is called
    "toggleLoadModal",              // when the load modal is clicked
    "clearSurvey",                  // when a survey clear is called
    "toggleParam",                  // when a config param is toggled for any type
    "itemDelete",                   // when an item (option/question/block) is called to be deleted
    "itemCopy",                     // when an item (question/block) is called to be copied
    "saveEditText",                 // when question text is changed
    "saveFreeText",                 // when freeText's default text is changed
    "undoSurvey",                   // when the undo button is clicked
    "scrollToItem",                 // when an item needs to be scrolled to
    "updateOptionGroup",            // when the default option group is changed
    "addOptionGroup",               // when an option group is added to the list
    "moveQuestion",                 // when a question is moved in the treeview
    "reorderItem"                   // when an item is reordered in the treeview
]);

module.exports = SurveyActions;
