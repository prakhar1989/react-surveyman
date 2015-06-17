var React = require('react');
var { DragSource } = require('react-dnd');
var cx = require('classnames');
var ItemTypes = require('./ItemTypes');

var nodeSource = {
    beginDrag(props) {
        return { id: props.id }
    }
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

var QuestionNode = React.createClass({
    propTypes: {
        collapsed: React.PropTypes.bool,
        defaultCollapsed: React.PropTypes.bool,
        label: React.PropTypes.node.isRequired,
        id: React.PropTypes.string.isRequired,
        handleClick: React.PropTypes.func.isRequired,
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

        var { isDragging, connectDragSource } = this.props;

        var arrowClass = cx({
            'ion-arrow-down-b': !collapsed,
            'ion-arrow-right-b': collapsed
        });

        var arrow = (<div onClick={this.handleCollapse} className="tree-view_arrow">
                        <i className={arrowClass}></i>
                    </div>);

        return connectDragSource(
           <div className='tree-view_node-question'> {arrow}
                <span onClick={props.handleClick} className="tree-view_question-title">{props.label}</span>
                { collapsed ? null : <div className="tree-view_children">{this.props.children}</div> }
           </div>
        )
    }
});

module.exports = DragSource(ItemTypes.QUESTIONNODE, nodeSource, collect)(QuestionNode);
