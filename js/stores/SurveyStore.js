var Reflux = require('reflux');
var SurveyData = require('../data.js');
var SurveyActions = require('../actions/SurveyActions');


var SurveyStore = Reflux.createStore({
    listenables: [SurveyActions],
    init() {
        this.listenTo(SurveyActions.load, this.fetchData);
    },
    getInitialState() {

    },
    fetchData() {
        // loading the data temporarily from file
        console.log(SurveyData);
    }
});

module.exports = SurveyStore;