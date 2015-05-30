var React = require('react');
var ReactDND = require('react-dnd');
var ItemTypes = require('./ItemTypes');
var Question = require('./Question');
var SurveyActions = require('../actions/SurveyActions');
var HelpText = require('./HelpText');
var ToggleParam = require('./ToggleParam');
var { List } = require('immutable');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var cx = require('classnames');

var Block = React.createClass({
    mixins: [ReactDND.DragDropMixin, PureRenderMixin],
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.QUESTION, {
                dropTarget: {
                    acceptDrop: function(component, item) {
                        component.handleQuestionDrop();
                    }
                }
            });
        }
    },
    propTypes: {
        id: React.PropTypes.string.isRequired,
        questions: React.PropTypes.instanceOf(List),
        subblocks: React.PropTypes.array.isRequired,
        randomizable: React.PropTypes.bool.isRequired,
        ordering: React.PropTypes.bool.isRequired
    },
    handleQuestionDrop() {
        SurveyActions.toggleModal(ItemTypes.QUESTION, this.props.id);
    },
    handleDelete() {
        var deleteConfirmation = confirm("Are you sure you want to delete this block, its associated questions and options?");
        if (deleteConfirmation) {
            SurveyActions.itemDelete(ItemTypes.BLOCK, this.props.id);
        }
    },
    render() {
        var questions = this.props.questions.map(q => {
            return <Question
                        key={q.get('id')}
                        options={q.get('options')}
                        id={q.get('id')}
                        qtext={q.get('qtext')}
                        ordering={q.get('ordering')}
                        exclusive={q.get('exclusive')}
                        freetext={q.get('freetext')} />
        });

        var dropState = this.getDropState(ItemTypes.QUESTION);
        var classes = cx({
            'item block': true,
            'dragging': dropState.isDragging,
            'hovering': dropState.isHovering
        });

        return (
            <div className={classes} {...this.dropTargetFor(ItemTypes.QUESTION)}>

                <div className="controls-area">
                    <ul>
                      <li><i title="Delete Block" className="ion-trash-b" onClick={this.handleDelete}></i></li>
                      <li><i title="Add Question" className="ion-plus-circled" onClick={this.handleQuestionDrop}></i></li>
                    </ul>  
                </div>

                {questions.count() > 0 ? questions : <HelpText itemType="Question" /> }

                <div className="config-area">
                    <ul>
                        <li>
                            <ToggleParam
                                icon="ion-shuffle"
                                helpText="Toggles whether questions are randomized"
                                toggleValue={this.props.ordering}
                                toggleName='ordering'
                                itemType={ItemTypes.BLOCK}
                                itemId={this.props.id} />
                        </li>
                        <li>
                            <ToggleParam
                                icon="ion-arrow-swap"
                                helpText="Toggles whether questions are ordered"
                                toggleValue={this.props.randomizable}
                                toggleName='randomizable'
                                itemType={ItemTypes.BLOCK}
                                itemId={this.props.id} />
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
});

module.exports = Block;
