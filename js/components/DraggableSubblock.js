var React = require('react');
var { DragSource } = require('react-dnd');
var ItemTypes = require('./ItemTypes');

var subblockGroupSource = {
    beginDrag(props) {
        return { item: {} }
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

var DraggableSubblock = React.createClass({
    render() {
        var blockColor = "#C33149";
        var { isDragging, connectDragSource } = this.props;

        return connectDragSource(
            <div style={{opacity: isDragging ? 0.4 : 1,
                        backgroundColor: blockColor}} className="draggable">
                <i className="ion-arrow-move"></i>
                Subblock
            </div>
        )
    }
});

module.exports = DragSource(ItemTypes.SUBBLOCK, subblockGroupSource, collect)(DraggableSubblock);
