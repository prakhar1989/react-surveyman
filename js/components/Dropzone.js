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
            })
        }
    },
    handleBlockDrop: function() {
        this.props.onBlockDropped();
    },
    render: function() {
        var style = {};

        var dropState = this.getDropState(ItemTypes.BLOCK),
            backgroundColor;

        if (dropState.isHovering) {
            backgroundColor = '#CAD2C5';
        } else if (dropState.isDragging) {
            backgroundColor = '#52796F';
        }
        style.backgroundColor = backgroundColor;

        return (
            <div {...this.dropTargetFor(ItemTypes.BLOCK)}
                style={style}
                className='dropzone'>
            {dropState.isHovering ? 'Release to drop' : 'Drag item here'}
            </div>
        )
    }
});

module.exports = Dropzone;
