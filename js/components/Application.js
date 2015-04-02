var React = require('react');
var Reflux = require('reflux');

var Pallet = require('./Pallet'),
    Toolbox = require('./Toolbox'),
    SurveyActions = require('../actions/SurveyActions'),
    SurveyStore = require('../stores/SurveyStore');

var Application = React.createClass({
    mixins: [Reflux.connect(SurveyStore)],
    componentDidMount: function() {
        SurveyActions.load();
    },
    render: function() {
        return (
            <div className="row">
                <div className="eight columns">
                    <Pallet survey={this.state.surveyData} />
                </div>
                <div className="four columns">
                    <Toolbox />
                </div>
            </div>
        )
    }
});

module.exports = Application;
