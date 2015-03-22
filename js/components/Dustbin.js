var ItemTypes = require('./ItemTypes.js');

var Dustbin = React.createClass({
    mixins: [ReactDND.DragDropMixin],
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.ITEM, {
                dropTarget: {
                    acceptDrop: function(component, item) {
                        window.alert('You dropped ' + item.name + '!');
                    }
                }
            })
        }
    },
    render: function() {
        var style = {};

        var dropState = this.getDropState(ItemTypes.ITEM),
            backgroundColor;

        if (dropState.isHovering) {
            backgroundColor = '#CAD2C5';
        } else if (dropState.isDragging) {
            backgroundColor = '#52796F';
        }
        style.backgroundColor = backgroundColor;

        return (
            <div {...this.dropTargetFor(ItemTypes.ITEM)}
                style={style}
                className='dropzone'>
            {dropState.isHovering ? 'Release to drop' : 'Drag item here'}
            </div>
        )
    }
});

module.exports = Dustbin;
