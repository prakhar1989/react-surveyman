var React = require('react'),
    ReactDND = require('react-dnd');

var ItemTypes = require('./ItemTypes');

var DraggableQuestion = React.createClass({
    mixins: [ReactDND.DragDropMixin],
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.QUESTION, {
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
        var isDragging = this.getDragState(ItemTypes.QUESTION).isDragging;
        style.opacity = isDragging ? 0.4 : 1;

        return (
            <div {...this.dragSourceFor(ItemTypes.QUESTION)}
                style={style} className="draggable">
                <i className="ion-plus-circled"></i> Question
            </div>
        )
    }
});

module.exports = DraggableQuestion;
