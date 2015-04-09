var React = require('react'),
    ReactDND = require('react-dnd');

var ItemTypes = require('./ItemTypes');
var Question = require('./Question');
var SurveyActions = require('../actions/SurveyActions');
var HelpText = require('./HelpText');

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
        id: React.PropTypes.number,
        questions: React.PropTypes.array,
        subblocks: React.PropTypes.array
    },
    getDefaultProps: function() {
        return {
            id: 0,
            questions: [],
            subblocks: []
        }
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
            </div>
        )
    }
});

module.exports = Block;
