var React = require('react');
var Reflux = require('reflux');
var QuestionModal = require('./QuestionModal');
var AlertBox = require('./AlertBox');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var { DragDropContext } = require('react-dnd');
var HTML5Backend = require('react-dnd/modules/backends/HTML5');

var Pallet = require('./Pallet'),
    Toolbox = require('./Toolbox'),
    SurveyActions = require('../actions/SurveyActions'),
    SurveyStore = require('../stores/SurveyStore'),
    TreeView = require('./TreeView');


var Application = React.createClass({
    // this causes setState to run whenever the store calls this.trigger
    mixins: [Reflux.connect(SurveyStore), PureRenderMixin],
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
                    msg={alertState.get('msg')}
                    level={alertState.get('level')}
                    visible={alertState.get('visible')} />
                <div className="col-sm-8">
                    <Pallet survey={surveyData} />
                </div>
                <div className="col-sm-4">
                    <Toolbox />
                    <TreeView survey={surveyData}/>
                </div>
            </div>
        )
    }
});

module.exports = DragDropContext(HTML5Backend)(Application);
