var React = require('react');
var BlockNode = require('./BlockNode');
var QuestionNode = require('./QuestionNode');
var SurveyActions = require('../actions/SurveyActions');
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
    return text.substr(0, 20) + (text.length > 20 ? "..." : "");
  },
  focusOnItem(id) {
    SurveyActions.scrollToItem(id);
  },
  handleDrop(sourceObj, targetObj) {
    let sourceObjQ = sourceObj[0] === 'q';
    let targetObjQ = targetObj[0] === 'q';
    if (sourceObjQ) {
      if (targetObjQ) {
        SurveyActions.moveQuestion(sourceObj, this.state.survey.get_question_by_id(targetObj).block.id);
      } else {
        SurveyActions.moveQuestion(sourceObj, targetObj);
      }
    } else {
      if (targetObj) {
        SurveyActions.moveBlock(sourceObj, this.state.survey.get_question_by_id(targetObj).block.id);
      } else {
        SurveyActions.moveBlock(sourceObj, targetObj);
      }
    }
  },
  moveBlock(draggedBlockId, overBlockId) {
    console.log('TreeView.moveBlock');
    SurveyActions.moveBlock(draggedBlockId, overBlockId);
  },
  moveQuestion(draggedQuestionId, overBlockId) {
    // questions cannot be reordered within blocks because they
    // are not truly ordered to begin with.
    console.log('TreeView.moveQuestion');
    SurveyActions.moveQuestion(draggedQuestionId, overBlockId);
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
               {self.renderSubblocks(subb)}

            </BlockNode>
    );
  },
  render() {
    var { survey } = this.state;
    var self = this;

    // build the tree
    var tree = survey.topLevelBlocks.map(block => {
      var questions = block.topLevelQuestions;
      return (
          <BlockNode key={block.id}
                     id={block.id}
                     block={block}
                     handleClick={self.focusOnItem.bind(this, block.id)}
                     handleDrop={self.handleDrop}
                     moveBlock={self.moveBlock}>
            {questions.map(ques =>
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
            {self.renderSubblocks(block)}
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
