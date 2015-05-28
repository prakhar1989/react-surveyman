var React = require('react');
var ReactDND = require('react-dnd');
var Options = require('./Options');
var ItemTypes = require('./ItemTypes');
var SurveyActions = require('../actions/SurveyActions');
var ToggleParam = require('./ToggleParam');
var { List } = require('immutable');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Question = React.createClass({
    mixins: [ReactDND.DragDropMixin, PureRenderMixin],
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.OPTION, {
                dropTarget: {
                    acceptDrop: function(component, item) {
                        component.handleOptionDrop();
                    }
                }
            })
        }
    },
    propTypes: {
        options: React.PropTypes.instanceOf(List).isRequired,
        id: React.PropTypes.number.isRequired,
        qtext: React.PropTypes.string.isRequired,
        ordering: React.PropTypes.bool.isRequired,
        freetext: React.PropTypes.bool.isRequired,
        exclusive: React.PropTypes.bool.isRequired
    },
    getInitialState: function() {
        return {
            editing: false
        }
    },
    handleDelete() {
        var deleteConfirmation = confirm("DANGER AHEAD: Are you sure you want to delete this " +
                        "question and its options? There's no undo for this action.");
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
    render: function() {
        var dropState = this.getDropState(ItemTypes.OPTION);

        var style = {};
        if (dropState.isHovering) {
            style.backgroundColor = '#f4fbd7';
        } else if (dropState.isDragging) {
            style.backgroundColor = "#eeeeee";
        }

        // placeholder for taking input when text is clicked
        var input = <input type="text"
                        defaultValue={this.props.qtext}
                        style={{width: 200}}
                        onBlur={this.handleEdit}
                        onKeyPress={this.handleEdit} />;

        return (
            <div className="item question"
                style={style}
                {...this.dropTargetFor(ItemTypes.OPTION)}>

                <div className="qtext-area">
                  <span className="qtext" onClick={this.toggleInput}>
                  { this.state.editing ? input : this.props.qtext }
                  </span>
                  <i className="ion-trash-b" onClick={this.handleDelete}></i>
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
        )
    }
});

module.exports = Question;
