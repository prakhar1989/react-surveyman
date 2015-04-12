var React = require('react');
var Reflux = require('reflux');
var QuestionModal = require('./QuestionModal');
var AlertBox = require('./AlertBox');

var Pallet = require('./Pallet'),
    Toolbox = require('./Toolbox'),
    SurveyActions = require('../actions/SurveyActions'),
    SurveyStore = require('../stores/SurveyStore');

var Application = React.createClass({
    mixins: [Reflux.connect(SurveyStore)],
    componentDidMount() {
        SurveyActions.load();
    },
    render() {
        var modalState = this.state.modalState;
        var alertState = this.state.alertState;
        return (
            <div className="row">
                <QuestionModal
                    isOpen={modalState.question}
                    parentID={this.state.dropTargetID}/>
                <AlertBox
                    msg={alertState.msg}
                    level={alertState.level}
                    visible={alertState.visible} />
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
