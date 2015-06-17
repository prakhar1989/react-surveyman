var React = require('react');
var cx = require('classnames');
var { DragSource, DropTarget } = require('react-dnd');
var ItemTypes = require('./ItemTypes');
var flow = require('lodash/function/flow');

var nodeSource = {
    beginDrag(props) {
        return {
            item: {}
        }
    }
};

var nodeTarget = {
    drop(props, monitor) {
        var item = monitor.getItem();
        console.log("Got: ", item);
    }
};

function dragCollect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

function dropCollect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver()
    }
}

var BlockNode = React.createClass({
    propTypes: {
        collapsed: React.PropTypes.bool,
        defaultCollapsed: React.PropTypes.bool,
        id: React.PropTypes.string.isRequired,
        handleClick: React.PropTypes.func.isRequired
    },
    getInitialState() {
        return {
            collapsed: this.props.defaultCollapsed || true
        };
    },
    handleCollapse(e) {
        this.setState({
            collapsed: !this.state.collapsed
        });
    },
    render() {
        var collapsed = this.props.collapsed != null ? 
                        this.props.collapsed : this.state.collapsed;

        var { isDragging, 
              connectDragSource, 
              id, 
              connectDropTarget,
              canDrop,
              isOver,
              handleClick,
              children } = this.props;

        var arrowClass = cx({
            'ion-arrow-down-b': !collapsed,
            'ion-arrow-right-b': collapsed
        });

        var classes = cx({
            'tree-view_node-block': true,
            'dragging': canDrop,
            'hovering': isOver
        });

        var arrow = (<div onClick={this.handleCollapse} className="tree-view_arrow">
                        <i className={arrowClass}></i>
                    </div>);

        return connectDragSource(connectDropTarget(
           <div className={classes}> {arrow}
                <span className="tree-view_block-title" onClick={handleClick}>{"Block #" + id}</span>
                { collapsed ? null : <div className="tree-view_children">{children}</div> }
           </div>
        ));
    }
});

module.exports = flow(
    DragSource(ItemTypes.BLOCKNODE, nodeSource, dragCollect),
    DropTarget(ItemTypes.QUESTIONNODE, nodeTarget, dropCollect)
)(BlockNode);
