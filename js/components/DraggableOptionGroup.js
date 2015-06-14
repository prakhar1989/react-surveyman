var React = require('react');
var { DragSource } = require('react-dnd');
var ItemTypes = require('./ItemTypes');

var optionGroupSource = {
    beginDrag(props) {
        return { item: {} }
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

var DraggableOptionGroup = React.createClass({
    render() {
        var { isDragging, connectDragSource } = this.props;

        return connectDragSource(
            <div style={{opacity: isDragging ? 0.4 : 1}} className="draggable">
                <i className="ion-plus-circled"></i>
                Options
            </div>
        )
    }
});

module.exports = DragSource(ItemTypes.OPTIONGROUP, optionGroupSource, collect)(DraggableOptionGroup);
