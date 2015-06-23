var React = require('react');
var cx = require('classnames');
var { DragSource, DropTarget } = require('react-dnd');
var ItemTypes = require('./ItemTypes');
var flow = require('lodash/function/flow');

/* setup for dragging block node */
var nodeSource = {
    beginDrag(props) {
        return { id: props.id }
    }
};

function dragCollect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

/* setup for allowing blocks to act as drop targets
 * for questions */
var questionTarget = {
    drop(props, monitor) {
        props.handleDrop(monitor.getItem().id, props.id);
    }
};

function dropCollect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver()
    }
}

/* setup for allowing blocks to act as drop target for other blocks.
 * this is required to implement sortable on blocks */
var blockTarget = {
    hover(props, monitor) {
        var draggedId = monitor.getItem().id;
        if (draggedId !== props.id) {
            props.reorderBlock(draggedId, props.id);
        }
    },
    drop(props) {
        // called when the hover ends - used to propagate
        // changes upstream
        props.handleDrop(props.id, props.id);
    }
};

function sortCollect(connect, monitor) {
    return {
        connectSortTarget: connect.dropTarget()
    }
}

var BlockNode = React.createClass({
    propTypes: {
        collapsed: React.PropTypes.bool,
        defaultCollapsed: React.PropTypes.bool,
        id: React.PropTypes.string.isRequired,
        handleClick: React.PropTypes.func.isRequired,
        reorderBlock: React.PropTypes.func.isRequired,
        moveBlock: React.PropTypes.func
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
              connectSortTarget,
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

        return connectSortTarget(connectDragSource(connectDropTarget(
           <div className={classes} style={{opacity: isDragging ? 0 : 1}}> {arrow}
                <span className="tree-view_block-title" onClick={handleClick}>{"Block #" + id}</span>
                { collapsed ? null : <div className="tree-view_children">{children}</div> }
           </div>
        )));
    }
});

module.exports = flow(
    DragSource(ItemTypes.BLOCKNODE, nodeSource, dragCollect),
    DropTarget(ItemTypes.BLOCKNODE, blockTarget, sortCollect),
    DropTarget(ItemTypes.QUESTIONNODE, questionTarget, dropCollect)
)(BlockNode);
