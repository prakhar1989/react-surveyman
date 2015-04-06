var Reflux = require('reflux');

var SurveyActions = Reflux.createActions([
    "load",                         // initial data load
    "blockDropped",                 // when block is dropped
    "questionDropped",              // when question is dropped
    "optionDropped",                // when option is dropped
    "toggleModal"                   // when option modal is toggled
]);

module.exports = SurveyActions;