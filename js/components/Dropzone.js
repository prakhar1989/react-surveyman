var ItemTypes = require('./ItemTypes.js');

var Dropzone = React.createClass({
    propTypes: {
        onBlockDropped: React.PropTypes.func,
        onQuestionDropped: React.PropTypes.func,
        onOptionDropped: React.PropTypes.func
    },
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

            register(ItemTypes.QUESTION, {
                dropTarget: {
                    acceptDrop: function(component, item) {
                        component.handleQuestionDrop();
                    }
                }
            })
        }
    },
    handleBlockDrop: function() {
        this.props.onBlockDropped();
    },
    handleQuestionDrop: function() {
        this.props.onQuestionDropped();
    },
    render: function() {
        var style = {},
            blockDropState = this.getDropState(ItemTypes.BLOCK),
            questionDropState = this.getDropState(ItemTypes.QUESTION),
            isHovering = blockDropState.isHovering || questionDropState.isHovering,
            isDragging = blockDropState.isDragging || questionDropState.isDragging,
            backgroundColor;

        if (isHovering) {
            backgroundColor = '#CAD2C5';
        } else if (isDragging) {
            backgroundColor = '#52796F';
        }
        style.backgroundColor = backgroundColor;

        // define a set of item types the dropzone accepts
        var accepts = [ItemTypes.BLOCK, ItemTypes.QUESTION];

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
