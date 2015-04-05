var React = require('react'),
    ReactDND = require('react-dnd');

var Block = require('./Block');
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('./ItemTypes');


var Survey = React.createClass({
    mixins:[ReactDND.DragDropMixin],
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.BLOCK, {
                dropTarget: {
                    acceptDrop: function(component, item) {
                        component.handleBlockDrop();
                    }
                }
            })
        }
    },
    propTypes: {
        survey: React.PropTypes.array.isRequired
    },
    handleBlockDrop() {
        SurveyActions.blockDropped();
    },
    render: function() {
        var survey = this.props.survey;

        var dropState = this.getDropState(ItemTypes.BLOCK);
        var style = {};
        if (dropState.isHovering) {
            style.backgroundColor = '#f4fbd7';
        } else if (dropState.isDragging) {
            style.backgroundColor = "#eeeeee";
        }

        return (
            <div style={style} className="survey"
                 {...this.dropTargetFor(ItemTypes.BLOCK)}>
            {survey.map(function(block) {
                return (
                    <Block key={block.id}
                        id={block.id}
                        questions={block.questions} />
                )
            })}
            </div>
        )
    }
});

module.exports = Survey;
