var React = require('react');
var { DragSource, DropTarget } = require('react-dnd');
var cx = require('classnames');
var flow = require('lodash/function/flow');
var ItemTypes = require('./ItemTypes');

/* setup for dragging question nodes */
var nodeSource = {
    beginDrag(props) {
        return { id: props.id }
    }
}

function dragCollect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

/* setup for allowing questions to act as drop targets for questions.
 * this is required to implement sortable on questions */
var questionTarget = {
    hover(props, monitor) {
        var draggedId = monitor.getItem().id;
        if (draggedId !== props.id) {
            props.reorderQuestion(draggedId, props.id);
        }
    }
}

function dropCollect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget()
    }
}

var QuestionNode = React.createClass({
    propTypes: {
        collapsed: React.PropTypes.bool,
        defaultCollapsed: React.PropTypes.bool,
        label: React.PropTypes.node.isRequired,
        id: React.PropTypes.string.isRequired,
        handleClick: React.PropTypes.func.isRequired,
        reorderQuestion: React.PropTypes.func.isRequired
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
        var props = this.props;
        var collapsed = props.collapsed != null ?
                        props.collapsed : this.state.collapsed;

        var { isDragging,
              connectDragSource,
              connectDropTarget } = this.props;

        var arrowClass = cx({
            'ion-arrow-down-b': !collapsed,
            'ion-arrow-right-b': collapsed
        });

        var arrow = (<div onClick={this.handleCollapse} className="tree-view_arrow">
                        <i className={arrowClass}></i>
                    </div>);

        return connectDropTarget(connectDragSource(
           <div className='tree-view_node-question' style={{opacity: isDragging ? 0 : 1}}> {arrow}
                <span onClick={props.handleClick} className="tree-view_question-title">{props.label}</span>
                { collapsed ? null : <div className="tree-view_children">{this.props.children}</div> }
           </div>
        ));
    }
});

module.exports = flow(
    DragSource(ItemTypes.QUESTIONNODE, nodeSource, dragCollect),
    DropTarget(ItemTypes.QUESTIONNODE, questionTarget, dropCollect)
)(QuestionNode);
