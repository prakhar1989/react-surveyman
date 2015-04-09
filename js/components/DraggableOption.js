var React = require('react'),
    ReactDND = require('react-dnd');

var ItemTypes = require('./ItemTypes');

var DraggableOption = React.createClass({
    mixins: [ReactDND.DragDropMixin],
    statics: {
        configureDragDrop: function(register){
            register(ItemTypes.OPTION, {
                dragSource: {
                    beginDrag: function(component){
                        // TODO: use this to transfer data
                        return {
                            item: {

                            }
                        }
                    }
                }
            });
        }
    },
    render() {
        var style = {};
        var isDragging = this.getDragState(ItemTypes.OPTION).isDragging;
        style.opacity = isDragging ? 0.4 :1;

        return (
            <div {...this.dragSourceFor(ItemTypes.OPTION)}
                style={style} className="draggable">
                <i className="ion-plus-circled"></i>
                Option
            </div>
        )
    }
});

module.exports = DraggableOption;
