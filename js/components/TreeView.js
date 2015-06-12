var React = require('react');
var TreeNode = require('./TreeNode');
var { List } = require('immutable');

var TreeView = React.createClass({
    propTypes: {
        survey: React.PropTypes.instanceOf(List)
    },
    renderProp(label, prop) {
        return prop ? <span><i className="ion-checkmark"></i> {label}</span> : 
                      <span><i className="ion-close"></i>  {label}</span>
    },
    ellipsize(text) {
        return text.substr(0, 20) + (text.length > 20 ? "..." : "");
    },
    render() {
        var { survey } = this.props;
        var self = this;

        // build the tree
        var tree = survey.map((block, i) => {
            var questions = block.get('questions');
            var blockLabel = <span className="tree-view_node-block">{"Block #" +  block.get('id')}</span>;
            return (
                <TreeNode key={i} label={blockLabel}>
                {questions.map((ques, j) => {
                    var quesLabel = <span className="tree-view_node-question">{self.ellipsize(ques.get('qtext'))}</span>;
                    return (
                        <TreeNode key={j} label={quesLabel} defaultCollapsed={false}>
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
