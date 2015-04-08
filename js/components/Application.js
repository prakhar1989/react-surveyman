var React = require('react');
var Reflux = require('reflux');
var QuestionModal = require('./QuestionModal');

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
        var modalState = this.state.modalState;
        return (
            <div className="row">
                <QuestionModal
                    isOpen={modalState.question}
                    parentID={this.state.dropTargetID}/>
                <div className="col-sm-8">
                    <Pallet survey={this.state.surveyData} />
                </div>
                <div className="col-sm-4">
                    <Toolbox />
                </div>
            </div>
        )
    }
});

module.exports = Application;
