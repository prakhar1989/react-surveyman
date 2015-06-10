var React = require('react');
var { DragSource } = require('react-dnd');
var ItemTypes = require('./ItemTypes.js');

// this is the specification that describes
// how the drag source reacts to the drag
// and drop events
var blockSource = {
    beginDrag(props) {
        return {
            item: {}
        }
    }
};

// the collecting function that injects 
// relevant props to the component
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

var DraggableBlock = React.createClass({
    render() {
        var { isDragging, connectDragSource } = this.props;

        return connectDragSource(
            <div style={{opacity: isDragging ? 0.4 : 1 }} className="draggable">
                <i className="ion-plus-circled"></i>
                Block
            </div>
        )
    }
});

module.exports = DragSource(ItemTypes.BLOCK, blockSource, collect)(DraggableBlock);
