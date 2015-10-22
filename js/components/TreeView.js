var React = require('react');
var BlockNode = require('./BlockNode');
var QuestionNode = require('./QuestionNode');
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('./ItemTypes');
var SurveyStore = require('../stores/SurveyStore');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var SurveyMan = require('../sub/surveyman.js/SurveyMan/surveyman');
var {Question, Block} = SurveyMan.survey;

var TreeView = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    survey: React.PropTypes.instanceOf(SurveyMan.survey.Survey).isRequired
  },
  getInitialState() {
    return {
      survey: this.props.survey,
      finalIndex: 0
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
    console.log('TreeView.ellipsize', text);
    return text.substr(0, 20) + (text.length > 20 ? "..." : "");
  },
  focusOnItem(id) {
    SurveyActions.scrollToItem(id);
  },
  handleDrop(sourceObj, targetObj) {
    console.log('TreeView.handleDrop doesn\'t do anything');
  },
  moveBlock(draggedBlockId, overBlockId) {
    console.log('TreeView.moveBlock');
    SurveyActions.moveBlock(draggedBlockId, overBlockId);
    // TODO: explicitly allow indices to be reordered.
    //let survey = this.state.survey;
    //let draggedBlock = survey.get_block_by_id(draggedBlockId);
    //let overBlock = survey.get_block_by_id(overBlockId);
    //let newSurvey = SurveyMan.add_block(
    //    SurveyMan.remove_block(draggedBlock, survey, false),
    //    draggedBlock,
    //    overBlock,
    //    false);
    //this.setState({
    //  survey: newSurvey,
    //  finalIndex: -1 // get rid of this?
    //});
  },
  moveQuestion(draggedQuestionId, overBlockId) {
    // questions cannot be reordered within blocks because they
    // are not truly ordered to begin with.
    console.log('TreeView.moveQuestion');
    SurveyActions.moveQuestion(draggedQuestionId, overBlockId);
    //let survey = this.state.survey;
    //let draggedQuestion = survey.get_question_by_id(draggedQuestionId);
    //let overBlock = survey.get_block_by_id(overBlockId);
    //let newSurvey = SurveyMan.add_question(
    //    draggedQuestion,
    //    overBlock,
    //    SurveyMan.remove_question(draggedQuestion, survey, false),
    //    false);
    //this.setState({
    //  survey: newSurvey,
    //  finalIndex: -1 // get rid of this?
    //});
  },
  renderSubblocks(block) {
    var subblocks = block.subblocks;
    var self = this;
    return subblocks.map(subb =>
            <BlockNode key={subb.id}
                       id={subb.id}
                       block={subb}
                       handleClick={self.focusOnItem.bind(this, subb.id)}
                       handleDrop={self.handleDrop}
                       moveBlock={self.moveBlock} >
               {self.renderSubblocks(subb)}

              {subb.topLevelQuestions.map(ques =>
                      <QuestionNode id={ques.id}
                                    key={ques.id}
                                    question={ques}
                                    label={self.ellipsize(ques.qtext)}
                                    handleClick={self.focusOnItem.bind(this, ques.id)}
                                    handleDrop={self.handleDrop}
                                    moveQuestion={self.moveQuestion}>
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
          <BlockNode key={block.id}
                     id={block.id}
                     handleClick={self.focusOnItem.bind(this, block.id)}
                     handleDrop={self.handleDrop}
                     moveBlock={self.moveBlock}>

            {self.renderSubblocks(block)}

            {questions.map(ques => {console.log(ques);
                <QuestionNode id={ques.id}
                              key={ques.id}
                              label={self.ellipsize(ques.qtext)}
                              handleClick={self.focusOnItem.bind(this, ques.id)}
                              handleDrop={self.handleDrop}
                              moveQuestion={self.moveQuestion}>
                  <div className="tree-view_node">{"Options: " + ques.options.length}</div>
                  <div className="tree-view_node">{self.renderProp('ordered', ques.ordered)}</div>
                  <div className="tree-view_node">{self.renderProp('exclusive', ques.exclusive)}</div>
                  <div className="tree-view_node">{self.renderProp('freetext', ques.freetext)}</div>
                </QuestionNode> }
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
