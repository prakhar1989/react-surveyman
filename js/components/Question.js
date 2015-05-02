var React = require('react');
var ReactDND = require('react-dnd');
var Option = require('./Option');
var ItemTypes = require('./ItemTypes');
var SurveyActions = require('../actions/SurveyActions');
var HelpText = require('./HelpText');
var ToggleParam = require('./ToggleParam');

var Question = React.createClass({
    mixins: [ReactDND.DragDropMixin],
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
        options: React.PropTypes.array.isRequired,
        id: React.PropTypes.number.isRequired,
        qtext: React.PropTypes.string.isRequired,
        ordering: React.PropTypes.bool.isRequired,
        freetext: React.PropTypes.bool.isRequired,
        exclusive: React.PropTypes.bool.isRequired
    },
    handleOptionDrop() {
        SurveyActions.optionDropped(this.props.id);
    },
    handleDelete() {
        var deleteConfirmation = confirm("DANGER AHEAD: Are you sure you want to delete this " +
                        "question and its options? There's no undo for this action.");
        if (deleteConfirmation) {
            SurveyActions.itemDelete(ItemTypes.QUESTION, this.props.id);
        }
    },
    handleEdit() {
        console.log("Edit text");
    },
    render: function() {
        var options = this.props.options.map(op => {
            return <Option key={op.id} otext={op.otext} />
        });

        var dropState = this.getDropState(ItemTypes.OPTION);
        var style = {};
        if (dropState.isHovering) {
            style.backgroundColor = '#f4fbd7';
        } else if (dropState.isDragging) {
            style.backgroundColor = "#eeeeee";
        }

        return (
            <div className="item question"
                style={style}
                {...this.dropTargetFor(ItemTypes.OPTION)}>
                <div className="qtext">
                    {this.props.qtext}
                    <span className="edit-controls">
                        <i className="ion-edit" onClick={this.handleEdit}></i>
                        <i className="ion-trash-b" onClick={this.handleDelete}></i>
                    </span>
                </div>
                <div> {options.length > 0 ? options : <HelpText itemType="Option" />} </div>
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
