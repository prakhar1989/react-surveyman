var ItemTypes = require('./ItemTypes.js');

var Block = React.createClass({
    mixins: [ReactDND.DragDropMixin],
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.ITEM, {
                dragSource: {
                    beginDrag: function(component) {
                        return {
                            item: {
                                name: component.props.name
                            }
                        };
                    }
                }
            });
        }
    },
    propTypes: {
        name: React.PropTypes.string.isRequired
    },
    render: function() {
        var style = {};

        var isDragging = this.getDragState(ItemTypes.ITEM).isDragging;
        style.opacity = isDragging ? 0.4 : 1;

        return (
            <div {...this.dragSourceFor(ItemTypes.ITEM)}
                style={style} className="block">
            {this.props.name}
            </div>
        )
    }
});

module.exports = Block;
