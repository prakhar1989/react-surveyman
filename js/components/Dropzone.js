var React = require('react'),
    ReactDND = require('react-dnd');

var ItemTypes = require('./ItemTypes.js');
var SurveyActions = require('../actions/SurveyActions');

var Dropzone = React.createClass({
    mixins: [ReactDND.DragDropMixin],
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.BLOCK, {
                dropTarget: {
                    acceptDrop: function(component, item) {
                        component.handleBlockDrop();
                    }
                }
            });
        }
    },
    handleBlockDrop() {
        SurveyActions.blockDropped();
    },
    render: function() {
        var style = {},
            blockDropState = this.getDropState(ItemTypes.BLOCK),
            isHovering = blockDropState.isHovering,
            isDragging = blockDropState.isDragging;

        var backgroundColor;

        if (isHovering) {
            backgroundColor = '#CAD2C5';
        } else if (isDragging) {
            backgroundColor = '#52796F';
        }
        style.backgroundColor = backgroundColor;

        // define a set of item types the dropzone accepts
        var accepts = [ItemTypes.BLOCK];

        return (
            <div {...this.dropTargetFor.apply(this, accepts)}
                style={style}
                className='dropzone'>
            {isHovering ? 'Release to drop' : 'Drag item here'}
            </div>
        )
    }
});

module.exports = Dropzone;
