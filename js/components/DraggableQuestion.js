var React = require('react');
var { DragSource } = require('react-dnd');
var ItemTypes = require('./ItemTypes');

var questionSource = {
    beginDrag(props) {
        return {
            item: {}
        }
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

var DraggableQuestion = React.createClass({
    render() {
        var { isDragging, connectDragSource } = this.props;

        return connectDragSource(
            <div style={{opacity: isDragging ? 0.4 : 1}} className="draggable">
                <i className="ion-plus-circled"></i>
                Question
            </div>
        )
    }
});

module.exports = DragSource(ItemTypes.QUESTION, questionSource, collect)(DraggableQuestion);
