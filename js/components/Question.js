var React = require('react');
var Options = require('./Options');
var ItemTypes = require('./ItemTypes');
var SurveyActions = require('../actions/SurveyActions');
var ToggleParam = require('./ToggleParam');
var { List } = require('immutable');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var cx = require('classnames');
var ItemControl = require('./ItemControl');
var { DropTarget } = require('react-dnd');
var SurveyMan = require('../sub/surveyman.js/SurveyMan/surveyman');

var questionTarget = {
  drop(props, monitor, component) {
    component.handleOptionGroupDrop();
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    canDrop: monitor.canDrop(),
    isOver: monitor.isOver()
  };
}

var Question = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    question: React.PropTypes.instanceOf(SurveyMan.survey.Question).isRequired,
    id: React.PropTypes.string.isRequired
  },
  handleOptionGroupDrop() {
    SurveyActions.optionGroupDropped(this.props.id);
  },
  getInitialState: function() {
    return {
      editing: false
    };
  },
  handleDelete() {
    var deleteConfirmation = confirm("Are you sure you want to delete this question and its options?");
    if (deleteConfirmation) {
      SurveyActions.itemDelete(ItemTypes.QUESTION, this.props.id);
    }
  },
  // toggles the state of question text field to editing
  toggleInput() {
    this.setState({
      editing: true
    });
  },
  /**
   * handler called when the textinput loses focus or detects change.
   * responsible for calling relevant action that saves the new text.
   */
  handleEdit(e) {
    if (e.type === "blur" ||
        (e.type === "keypress" && e.key === "Enter")) {

      this.setState({ editing: false });

      // if the new value is blank do nothing
      if (e.target.value.trim() === "") {
        return;
      }
      SurveyActions.saveEditText(e.target.value, this.props.id);
    }
  },
  handleFreeTextEdit(e) {
    if (e.type === "keypress" && e.key === "Enter") {
      if (e.target.value.trim() === "") {
        return;
      }
      SurveyActions.saveFreeText(e.target.value, this.props.id);
    }
  },
  handleCopy() {
    SurveyActions.itemCopy(ItemTypes.QUESTION, this.props.id);
  },
  render: function() {
    var { canDrop, isOver, connectDropTarget, question } = this.props;

    var classes = cx({
      'item question': true,
      'dragging': canDrop,
      'hovering': isOver
    });

    // placeholder for taking input when text is clicked
    var input = <input type="text"
                       defaultValue={question.qtext}
                       style={{width: 200}}
                       onBlur={this.handleEdit}
                       onKeyPress={this.handleEdit} />;

    var freeTextInput = <input type="text"
                               placeholder="Default text (if any). Press Enter to save."
                               defaultValue={question.freetext}
                               onKeyPress={this.handleFreeTextEdit} />;

    return connectDropTarget(
        <div className={classes} id={this.props.id}>

          <div className="qtext-area">
            <span className="qtext" onClick={this.toggleInput}>
              { this.state.editing ? input : question.qtext }
            </span>

            <div className="controls-area">
              <ul>
                <li><ItemControl icon="ion-trash-b" helpText="Delete this question" handleClick={this.handleDelete}/></li>
                <li><ItemControl icon="ion-ios-copy" helpText="Clone this question" handleClick={this.handleCopy}/></li>
              </ul>
            </div>
          </div>

          <Options options={question.options} questionId={this.props.id} />

                <div className="config-area">
                    <ul>
                        <li>
                            <ToggleParam
                                icon="ion-shuffle"
                                helpText="Toggles whether options are randomized"
                                toggleValue={question.ordered}
                                toggleName='ordered'
                                itemType={ItemTypes.QUESTION}
                                itemId={this.props.id} />
                        </li>
                        <li>
                            <ToggleParam
                                icon="ion-android-radio-button-on"
                                helpText="Toggles whether options appear as radio button or checkbox"
                                toggleValue={question.exclusive}
                                toggleName='exclusive'
                                itemType={ItemTypes.QUESTION}
                                itemId={this.props.id} />
                        </li>
                        <li>
                            <ToggleParam
                                icon="ion-document-text"
                                helpText="Toggles whether free text can be entered"
                                toggleValue={typeof question.freetext === "string"}
                                toggleName='freetext'
                                itemType={ItemTypes.QUESTION}
                                itemId={this.props.id} />
                        </li>
                    </ul>
                </div>

                <div className="freeText-area">
                    { question.freetext ? freeTextInput : null}
                </div>

            </div>
        );
    }
});

module.exports = DropTarget(ItemTypes.OPTIONGROUP, questionTarget, collect)(Question);
