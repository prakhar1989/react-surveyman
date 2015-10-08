var React = require('react');
var { List } = require('immutable');
var BlockNode = require('./BlockNode');
var QuestionNode = require('./QuestionNode');
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('./ItemTypes');
var SurveyStore = require('../stores/SurveyStore');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var SurveyMan = require('../sub/surveyman.js/SurveyMan/surveyman');

var TreeView = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    survey: React.PropTypes.instanceOf(SurveyMan.survey.Survey).isRequired
  },
  getInitialState() {
    return {
      survey: this.props.survey,
      finalIndex: -1
    };
  },
  componentWillReceiveProps(nextProps) {
    this.setState({
      survey: nextProps.survey,
      finalIndex: -1
    });
  },
  renderProp(label, prop) {
    return prop ? <span><i className="ion-checkmark"></i>{label}</span> :
        <span><i className="ion-close"></i>{label}</span>;
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
      // TODO(etosch): Figure out where state is bound
      SurveyActions.reorderItem(sourceID, this.state.finalIndex, sourceType);
    }
  },
  reorderBlock(draggedBlockId, overBlockId) {
    // TODO(etosch): figure out where state is coming from.
    var survey = this.state.survey;
    // TODO: This is only reordering over top level blocks -- previously hierarchy was represented differently.
    var draggedBlockIndex = survey.topLevelBlocks.findIndex(b => b.id === draggedBlockId);
    var overBlockIndex = survey.topLevelBlocks.findIndex(b => b.id === overBlockId);

    var block = SurveyMan.copy_block(survey.topLevelBlocks[draggedBlockIndex]);
    var newSurvey = SurveyMan.delete_block(block, survey, false);
    SurveyMan.add_block(block, survey, true, overBlockIndex);
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
    // TODO: again this only works for top level blocks
    var draggedBlockIndex = survey.topLevelBlocks.findIndex(b => b.id === draggedBlockId);
    var overBlockIndex = survey.topLevelBlocks.findIndex(b => b.id === overBlockId);
    var draggedBlock = survey.topLevelBlocks[draggedBlockIndex];
    var overBlock = survey.topLevelBlocks[overBlockIndex];

    // get indices of the drop and drag targets (questions) themselves

    var draggedQuestionIndex = draggedBlock.block.topLevelQuestions
        .findIndex(q => q.id === draggedQuestionId);

    console.log('TreeView.reorderQuestion NYI');
        //// this gives an error - q is undefined
        //var overQuestionIndex = overBlock.questions
        //                              .findIndex(q => q.get('id') === overQuestionId);
        //
        //// cache the question being dragged
        //var draggedQuestion = draggedBlock.getIn(['questions', draggedQuestionIndex]);
        //
        //// ensure that the question is being ordered withtin the same block
        //if (draggedBlockId === overBlockId) {
        //    newSurvey = survey.updateIn([draggedBlockIndex, 'questions'],
        //        (questions) => questions.delete(draggedQuestionIndex)
        //                                .splice(overQuestionIndex, 0, draggedQuestion)
        //    );
        //
        //    // change the state
        //    this.setState({
        //        survey: newSurvey,
        //        finalIndex: overQuestionIndex
        //    });
        //}
    },
  renderSubblocks(block) {
    var subblocks = block.subblocks;
    var self = this;
    return subblocks.map(subb =>
            <BlockNode key={subb.id} id={subb.id}
                       handleClick={self.focusOnItem.bind(this, subb.id)}
                       handleDrop={self.handleDrop}
                       reorderBlock={self.reorderBlock} >
               {self.renderSubblocks(subb)}

              {subb.topLevelQuestions.map(ques =>
                      <QuestionNode id={ques.id}
                                    key={ques.id}
                                    label={self.ellipsize(ques.qtext)}
                                    handleClick={self.focusOnItem.bind(this, ques.id)}
                                    handleDrop={self.handleDrop}
                                    reorderQuestion={self.reorderQuestion}>
                        <div className="tree-view_node">{"Options: " + ques.options.length}</div>
                        <div className="tree-view_node">{self.renderProp('ordered', ques.ordered)}</div>
                        <div className="tree-view_node">{self.renderProp('exclusive', ques.exclusive)}</div>
                        <div className="tree-view_node">{self.renderProp('freetext', ques.freetext)}</div>
                      </QuestionNode>
              )}
            </BlockNode>
    );
  },
  render() {
    var { survey } = this.state;
    var self = this;

    // build the tree
    var tree = survey.topLevelBlocks.map((block) => {
      var questions = block.topLevelQuestions;
      return (
          <BlockNode key={block.id} id={block.id}
                     handleClick={self.focusOnItem.bind(this, block.id)}
                     handleDrop={self.handleDrop}
                     reorderBlock={self.reorderBlock}>

            {self.renderSubblocks(block)}

            {questions.map(ques =>
                    <QuestionNode id={ques.id}
                                  key={ques.id}
                                  label={self.ellipsize(ques.qtext)}
                                  handleClick={self.focusOnItem.bind(this, ques.id)}
                                  handleDrop={self.handleDrop}
                                  reorderQuestion={self.reorderQuestion}>
                      <div className="tree-view_node">{"Options: " + ques.options.length}</div>
                      <div className="tree-view_node">{self.renderProp('ordered', ques.ordered)}</div>
                      <div className="tree-view_node">{self.renderProp('exclusive', ques.exclusive)}</div>
                      <div className="tree-view_node">{self.renderProp('freetext', ques.freetext)}</div>
                    </QuestionNode>
            )}
          </BlockNode>
      );
    });

    return (
        <div className="tree-view">
          <h3>Minimap <span className="help-text">Drag items to re-order</span></h3>
          {tree}
        </div>
    );
  }
});

module.exports = TreeView;
