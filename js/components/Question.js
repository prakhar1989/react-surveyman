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
        options: React.PropTypes.instanceOf(List).isRequired,
        id: React.PropTypes.string.isRequired,
        qtext: React.PropTypes.string.isRequired,
        ordering: React.PropTypes.bool.isRequired,
        freetext: React.PropTypes.bool.isRequired,
        exclusive: React.PropTypes.bool.isRequired
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
    handleCopy() {
        SurveyActions.itemCopy(ItemTypes.QUESTION, this.props.id);
    },
    render: function() {
        var { canDrop, isOver, connectDropTarget } = this.props;

        var classes = cx({
            'item question': true,
            'dragging': canDrop,
            'hovering': isOver
        });

        // placeholder for taking input when text is clicked
        var input = <input type="text"
                        defaultValue={this.props.qtext}
                        style={{width: 200}}
                        onBlur={this.handleEdit}
                        onKeyPress={this.handleEdit} />;

        return connectDropTarget(
            <div className={classes} id={this.props.id}>

                <div className="qtext-area">
                  <span className="qtext" onClick={this.toggleInput}>
                  { this.state.editing ? input : this.props.qtext }
                  </span>

                  <div className="controls-area">
                      <ul>
                          <li><ItemControl icon="ion-trash-b" helpText="Delete this question" handleClick={this.handleDelete}/></li>
                          <li><ItemControl icon="ion-ios-copy" helpText="Clone this question" handleClick={this.handleCopy}/></li>
                      </ul>
                  </div>
                </div>

                <Options options={this.props.options} questionId={this.props.id} />

                <div className="config-area">
                    <ul>
                        <li>
                            <ToggleParam
                                icon="ion-shuffle"
                                helpText="Toggles whether options are randomized"
                                toggleValue={this.props.ordering}
                                toggleName='ordering'
                                itemType={ItemTypes.QUESTION}
                                itemId={this.props.id} />
                        </li>
                        <li>
                            <ToggleParam
                                icon="ion-android-radio-button-on"
                                helpText="Toggles whether options appear as radio button or checkbox"
                                toggleValue={this.props.exclusive}
                                toggleName='exclusive'
                                itemType={ItemTypes.QUESTION}
                                itemId={this.props.id} />
                        </li>
                        <li>
                            <ToggleParam
                                icon="ion-document-text"
                                helpText="Toggles whether free text can be entered"
                                toggleValue={this.props.freetext}
                                toggleName='freetext'
                                itemType={ItemTypes.QUESTION}
                                itemId={this.props.id} />
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
});

module.exports = DropTarget(ItemTypes.OPTIONGROUP, questionTarget, collect)(Question);
