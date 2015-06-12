var React = require('react');
var cx = require('classnames');
var ItemTypes = require('./ItemTypes');

var TreeNode = React.createClass({
    propTypes: {
        collapsed: React.PropTypes.bool,
        defaultCollapsed: React.PropTypes.bool,
        type: React.PropTypes.oneOf([ItemTypes.BLOCK, ItemTypes.QUESTION]).isRequired,
        label: React.PropTypes.node.isRequired
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

        var arrowClass = cx({
            'ion-arrow-down-b': !collapsed,
            'ion-arrow-right-b': collapsed
        });
        var containerClass = cx({
            'tree-view_node-block': props.type === ItemTypes.BLOCK,
            'tree-view_node-question': props.type === ItemTypes.QUESTION
        });

        var arrow = (<div onClick={this.handleCollapse} className="tree-view_arrow">
                        <i className={arrowClass}></i>
                    </div>);

        return (
           <div className={containerClass}> {arrow}
                <span onClick={this.handleClick}>{props.label}</span>
                { collapsed ? null : <div className="tree-view_children">{this.props.children}</div> }
           </div>
        )
    }
});

module.exports = TreeNode;
