var React = require('react');
var { List } = require('immutable');
var BlockNode = require('./BlockNode');
var QuestionNode = require('./QuestionNode');
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('./ItemTypes');
var SurveyStore = require('../stores/SurveyStore');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var TreeView = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        survey: React.PropTypes.instanceOf(List).isRequired
    },
    getInitialState() {
        return {
            survey: this.props.survey,
            finalIndex: -1
        }
    },
    componentWillReceiveProps(nextProps) {
        this.setState({
            survey: nextProps.survey,
            finalIndex: -1
        });
    },
    renderProp(label, prop) {
        return prop ? <span><i className="ion-checkmark"></i> {label}</span> :
                      <span><i className="ion-close"></i>  {label}</span>
    },
    ellipsize(text) {
        return text.substr(0, 20) + (text.length > 20 ? "..." : "");
    },
    focusOnItem(id) {
        SurveyActions.scrollToItem(id);
    },
    handleDrop(sourceID, targetID) {
        var sourceType = sourceID[0] === "q" ? ItemTypes.QUESTION : ItemTypes.BLOCK;
        var targetType = targetID[0] === "b" ? ItemTypes.BLOCK : ItemTypes.QUESTION;

        if (sourceType === ItemTypes.QUESTION && targetType === ItemTypes.BLOCK) {
            // when a question is dropped in a block
            SurveyActions.moveQuestion(sourceID, targetID);
        } else {
            // when a question is dropped on a question or a block is dropped on a block
            SurveyActions.reorderItem(sourceID, this.state.finalIndex, sourceType)
        }
    },
    reorderBlock(draggedBlockId, overBlockId) {
        var survey = this.state.survey;
        var draggedBlockIndex = survey.findIndex(b => b.get('id') === draggedBlockId);
        var overBlockIndex = survey.findIndex(b => b.get('id') === overBlockId);

        var block = survey.get(draggedBlockIndex);
        var newSurvey = survey.delete(draggedBlockIndex).splice(overBlockIndex, 0, block);
        this.setState({
            survey: newSurvey,
            finalIndex: overBlockIndex
        });
    },
    reorderQuestion(draggedQuestionId, overQuestionId) {
        var survey = this.state.survey;
        var newSurvey;

        // get indices of the blocks holding the drag and drop targets (questions)
        var draggedBlockId = SurveyStore.getBlockId(draggedQuestionId);
        var overBlockId = SurveyStore.getBlockId(overQuestionId);
        var draggedBlockIndex = survey.findIndex(b => b.get('id') === draggedBlockId);
        var overBlockIndex = survey.findIndex(b => b.get('id') === overBlockId);
        var draggedBlock = survey.get(draggedBlockIndex);
        var overBlock = survey.get(overBlockIndex);

        // get indices of the drop and drag targets (questions) themselves
        var draggedQuestionIndex = draggedBlock.get('questions')
                                      .findIndex(q => q.get('id') === draggedQuestionId);

        // this gives an error - q is undefined
        var overQuestionIndex = overBlock.get('questions')
                                      .findIndex(q => q.get('id') === overQuestionId);

        // cache the question being dragged
        var draggedQuestion = draggedBlock.getIn(['questions', draggedQuestionIndex]);

        // ensure that the question is being ordered withtin the same block
        if (draggedBlockId === overBlockId) {
            newSurvey = survey.updateIn([draggedBlockIndex, 'questions'],
                (questions) => questions.delete(draggedQuestionIndex)
                                        .splice(overQuestionIndex, 0, draggedQuestion)
            );

            // change the state
            this.setState({
                survey: newSurvey,
                finalIndex: overQuestionIndex
            });
        }
    },
    renderSubblocks(block) {
        var subblocks = block.get('subblocks');
        var self = this;
        return subblocks.map(subb =>
                <BlockNode key={subb.get('id')} id={subb.get('id')}
                   handleClick={self.focusOnItem.bind(this, subb.get('id'))}
                   handleDrop={self.handleDrop}
                   reorderBlock={self.reorderBlock} >

                     {self.renderSubblocks(subb)}

                     {subb.get('questions').map(ques =>
                        <QuestionNode id={ques.get('id')}
                                      key={ques.get('id')}
                                      label={self.ellipsize(ques.get('qtext'))}
                                      handleClick={self.focusOnItem.bind(this, ques.get('id'))}
                                      handleDrop={self.handleDrop}
                                      reorderQuestion={self.reorderQuestion}>
                            <div className="tree-view_node">{"Options: " + ques.get('options').count()}</div>
                            <div className="tree-view_node">{self.renderProp('ordering', ques.get('ordering'))}</div>
                            <div className="tree-view_node">{self.renderProp('exclusive', ques.get('exclusive'))}</div>
                            <div className="tree-view_node">{self.renderProp('freetext', ques.get('freetext'))}</div>
                        </QuestionNode>
                     )}
               </BlockNode>
       );
    },
    render() {
        var { survey } = this.state;
        var self = this;

        // build the tree
        var tree = survey.map((block, i) => {
            var questions = block.get('questions');
            var subblocks = block.get('subblocks');
            return (
                <BlockNode key={block.get('id')} id={block.get('id')}
                           handleClick={self.focusOnItem.bind(this, block.get('id'))}
                           handleDrop={self.handleDrop}
                           reorderBlock={self.reorderBlock}>

                    {self.renderSubblocks(block)}

                    {questions.map(ques =>
                        <QuestionNode id={ques.get('id')}
                                      key={ques.get('id')}
                                      label={self.ellipsize(ques.get('qtext'))}
                                      handleClick={self.focusOnItem.bind(this, ques.get('id'))}
                                      handleDrop={self.handleDrop}
                                      reorderQuestion={self.reorderQuestion}>
                            <div className="tree-view_node">{"Options: " + ques.get('options').count()}</div>
                            <div className="tree-view_node">{self.renderProp('ordering', ques.get('ordering'))}</div>
                            <div className="tree-view_node">{self.renderProp('exclusive', ques.get('exclusive'))}</div>
                            <div className="tree-view_node">{self.renderProp('freetext', ques.get('freetext'))}</div>
                        </QuestionNode>
                     )}

                </BlockNode>
            )
        });

        return (
            <div className="tree-view">
                <h3>Minimap <span className="help-text">Drag items to re-order</span></h3>
                {tree}
            </div>
        )
    }
});

module.exports = TreeView;
