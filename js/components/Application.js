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
              surveyData,
              optionGroupState } = this.state;
        return (
            <div className="row">
                <QuestionModal
                    isOpen={modalState.get('isOpen')}
                    parentID={modalState.get('dropTargetID')}/>
                <AlertBox
                    msg={alertState.get('msg')}
                    level={alertState.get('level')}
                    visible={alertState.get('visible')} />
                <div className="col-md-8">
                    <Pallet survey={surveyData} />
                </div>
                <div className="col-md-4">
                    <div id="sidebar" data-spy="affix" data-offset-top="100" data-offset-bottom="50">
                        <Toolbox
                            optionGroups={optionGroupState.get('options')}
                            optionGroupId={optionGroupState.get('selectedID')} />
                        <TreeView survey={surveyData}/>
                     </div>
                </div>
            </div>
        );
    }
});

module.exports = DragDropContext(HTML5Backend)(Application);
