var React = require('react'),
    ReactDND = require('react-dnd');

var ItemTypes = require('./ItemTypes.js');

var DraggableBlock = React.createClass({
    mixins: [ReactDND.DragDropMixin],
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.BLOCK, {
                dragSource: {
                    beginDrag: function(component) {
                        // TODO: use this to transfer data
                        return {
                            item: {
                            }
                        };
                    }
                }
            });
        }
    },
    render: function() {
        var style = {};

        var isDragging = this.getDragState(ItemTypes.BLOCK).isDragging;
        style.opacity = isDragging ? 0.4 : 1;

        return (
            <div {...this.dragSourceFor(ItemTypes.BLOCK)}
                style={style} className="draggable">
                <i className="ion-plus-circled"></i> Block
            </div>
        )
    }
});

module.exports = DraggableBlock;
