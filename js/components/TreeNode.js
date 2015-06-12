var React = require('react');
var cx = require('classnames');

var TreeNode = React.createClass({
    propTypes: {
        collapsed: React.PropTypes.bool,
        defaultCollapsed: React.PropTypes.bool,
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

        var arrow = (<div onClick={this.handleCollapse} className="tree-view_arrow">
                        <i className={arrowClass}></i>
                    </div>);

        return (
           <div className="tree-view"> {arrow}
                <span onClick={this.handleClick}>{props.label}</span>
                { collapsed ? null : <div>{this.props.children}</div> }
           </div>
        )
    }
});

module.exports = TreeNode;
