var ItemTypes = require('./ItemTypes.js');

var Item = React.createClass({
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
        var style = {
            border: '1px dashed gray',
            backgroundColor: 'white',
            padding: '0.5rem',
            margin: '0.5rem',
            maxWidth: 80
        };

        //var isDragging = this.getDragState(ItemTypes.ITEM).isDragging;
        var isDragging = this.getDragState(ItemTypes.ITEM).isDragging;
        style.opacity = isDragging ? 0.4 : 1;

        return (
            <div {...this.dragSourceFor(ItemTypes.ITEM)}
                style={style}>
            {this.props.name}
            </div>
        )
    }
});

module.exports = Item;
