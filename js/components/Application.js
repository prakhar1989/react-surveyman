var React = require('react');

var Pallet = require('./Pallet'),
    Toolbox = require('./Toolbox'),
    surveyData = require('../data'),
    SurveyActions = require('../actions/SurveyActions'),
    SurveyStore = require('../stores/SurveyStore');

var Application = React.createClass({
    componentDidMount: function() {
        SurveyActions.load();
    },
    render: function() {
        return (
            <div className="row">
                <div className="eight columns">
                    <Pallet survey={surveyData} />
                </div>
                <div className="four columns">
                    <Toolbox />
                </div>
            </div>
        )
    }
});

module.exports = Application;
