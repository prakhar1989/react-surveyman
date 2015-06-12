var React = require('react');
var TreeNode = require('./TreeNode');
var { List } = require('immutable');

var TreeView = React.createClass({
    propTypes: {
        survey: React.PropTypes.instanceOf(List)
    },
    render() {
        return (
            <div className="treeview">
                <h3>Minimap</h3>
                <TreeNode label="hello">
                </TreeNode>
            </div>
        )
    }
});

module.exports = TreeView;
