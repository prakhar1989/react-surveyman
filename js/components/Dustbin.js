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
        var style = {
            height: '12rem',
            width: '12rem',
            color: 'white',
            padding: '2rem',
            textAlign: 'center'
        };

        var dropState = this.getDropState(ItemTypes.ITEM),
            backgroundColor = '#222';

        if (dropState.isHovering) {
            backgroundColor = 'darkgreen';
        } else if (dropState.isDragging) {
            backgroundColor = 'darkkhaki';
        }
        style.backgroundColor = backgroundColor;

        return (
            <div {...this.dropTargetFor(ItemTypes.ITEM)}
                style={style}>
            {dropState.isHovering ? 'Release to drop' : 'Drag item here'}
            </div>
        )
    }
});

module.exports = Dustbin;
