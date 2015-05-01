var React = require('react');
var ReactDND = require('react-dnd');
var ItemTypes = require('./ItemTypes');
var Question = require('./Question');
var SurveyActions = require('../actions/SurveyActions');
var HelpText = require('./HelpText');
var ToggleParam = require('./ToggleParam');

var Block = React.createClass({
    mixins: [ReactDND.DragDropMixin],
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
        id: React.PropTypes.number.isRequired,
        questions: React.PropTypes.array.isRequired,
        subblocks: React.PropTypes.array.isRequired,
        randomizable: React.PropTypes.bool.isRequired,
        ordering: React.PropTypes.bool.isRequired
    },
    handleQuestionDrop() {
        SurveyActions.toggleModal(ItemTypes.QUESTION, this.props.id);
    },
    render() {
        var questions = this.props.questions.map(q => {
            return <Question
                        key={q.id}
                        options={q.options}
                        id={q.id}
                        qtext={q.qtext}
                        ordering={q.ordering}
                        exclusive={q.exclusive}
                        freetext={q.freetext} />
        });

        var dropState = this.getDropState(ItemTypes.QUESTION);
        var style = {};
        if (dropState.isHovering) {
            style.backgroundColor = '#f4fbd7';
        } else if (dropState.isDragging) {
            style.backgroundColor = "#eeeeee";
        }

        return (
            <div className="item block"
                {...this.dropTargetFor(ItemTypes.QUESTION)} style={style}>
                {questions.length > 0 ? questions : <HelpText itemType="Question" /> }
                <div className="config-area">
                    <ul>
                        <li>
                            <ToggleParam
                                icon="ion-shuffle"
                                helpText="Toggles whether questions are randomized"
                                toggleProp={this.props.ordering} />
                        </li>
                        <li>
                            <ToggleParam
                                icon="ion-arrow-swap"
                                helpText="Toggles whether questions are ordered"
                                toggleProp={this.props.randomizable} />
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
});

module.exports = Block;
