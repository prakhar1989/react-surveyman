var Reflux = require('reflux');

var SurveyActions = Reflux.createActions([
    "load",                         // initial data load
    "blockDropped",                 // when block is dropped on dropzone
    "questionDropped",              // when question is dropped in dropzone
    "optionDropped"                 // when option is dropped in dropzone
]);

module.exports = SurveyActions;