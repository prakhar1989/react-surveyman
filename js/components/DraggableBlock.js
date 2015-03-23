var ItemTypes = require('./ItemTypes.js');

var DraggableBlock = React.createClass({
    mixins: [ReactDND.DragDropMixin],
    getDefaultProps: function() {
        return {
            itemId: 0
        }
    },
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.BLOCK, {
                dragSource: {
                    beginDrag: function(component) {
                        return {
                            item: {
                                itemId: component.props.itemId
                            }
                        };
                    }
                }
            });
        }
    },
    propTypes: {
        itemId: React.PropTypes.number
    },
    render: function() {
        var style = {};

        var isDragging = this.getDragState(ItemTypes.BLOCK).isDragging;
        style.opacity = isDragging ? 0.4 : 1;

        return (
            <div {...this.dragSourceFor(ItemTypes.BLOCK)}
                style={style} className="block">
                Block
            </div>
        )
    }
});

module.exports = DraggableBlock;
