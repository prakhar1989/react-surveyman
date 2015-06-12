var React = require('react');
var TreeNode = require('./TreeNode');
var { List } = require('immutable');

var TreeView = React.createClass({
    propTypes: {
        survey: React.PropTypes.instanceOf(List)
    },
    renderProp(label, prop) {
        return prop ? <span>{label + ": True"}</span> : 
                      <span>{label + ": False"}</span>
    },
    render() {
        var { survey } = this.props;
        var self = this;

        // build the tree
        var tree = survey.map(function(block, i) {
            var questions = block.get('questions');
            return (
                <TreeNode key={i} label={"Block #" + block.get('id')}>
                {questions.map(function(ques, j) {
                    var label = <span className="node">{ques.get('qtext').substr(0, 20)}</span>;
                    return (
                        <TreeNode key={j} label={label} defaultCollapsed={false}>
                            <div className="tree-view_node">{"Options: " + ques.get('options').count()}</div>
                            <div className="tree-view_node">{self.renderProp('randomizable', ques.get('randomizable'))}</div>
                            <div className="tree-view_node">{self.renderProp('exclusive', ques.get('exclusive'))}</div>
                            <div className="tree-view_node">{self.renderProp('freetext', ques.get('freetext'))}</div>
                        </TreeNode>
                    )
                 })}
                </TreeNode>
            )
        });

        return (
            <div className="tree-view">
                <h3>Minimap</h3>
                {tree}
            </div>
        )
    }
});

module.exports = TreeView;
