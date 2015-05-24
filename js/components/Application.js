var React = require('react');
var Reflux = require('reflux');
var QuestionModal = require('./QuestionModal');
var AlertBox = require('./AlertBox');

var Pallet = require('./Pallet'),
    Toolbox = require('./Toolbox'),
    SurveyActions = require('../actions/SurveyActions'),
    SurveyStore = require('../stores/SurveyStore');

var Application = React.createClass({
    // this causes setState to run whenever 
    // the store calls this.trigger
    mixins: [Reflux.connect(SurveyStore)],
    componentDidMount() {
        SurveyActions.load();
    },
    render() {
        var { modalState, 
              alertState, 
              dropTargetID,
              surveyData } = this.state;
        return (
            <div className="row">
                <QuestionModal
                    isOpen={modalState.get('isOpen')}
                    parentID={modalState.get('dropTargetID')}/>
                <AlertBox
                    msg={alertState.msg}
                    level={alertState.level}
                    visible={alertState.visible} />
                <div className="col-sm-8">
                    <Pallet survey={surveyData} />
                </div>
                <div className="col-sm-4">
                    <Toolbox />
                </div>
            </div>
        )
    }
});

module.exports = Application;
