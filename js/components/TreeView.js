var React = require('react');
var TreeNode = require('./TreeNode');
var { List } = require('immutable');
var ItemTypes = require('./ItemTypes');

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
    focusOnItem(id) {
        window.location.hash = id;
    },
    render() {
        var { survey } = this.props;
        var self = this;

        // build the tree
        var tree = survey.map((block, i) => {
            var questions = block.get('questions');
            var blockLabel = <span className="tree-view_block-title">{"Block #" +  block.get('id')}</span>;
            return (
                <TreeNode key={i} label={blockLabel} type={ItemTypes.BLOCK} 
                            handleClick={self.focusOnItem.bind(this, block.get('id'))}>

                    {questions.map((ques, j) => {
                        var quesLabel = <span className="tree-view_question-title">{self.ellipsize(ques.get('qtext'))}</span>;
                        return (
                            <TreeNode key={j} label={quesLabel} type={ItemTypes.QUESTION} 
                                        handleClick={self.focusOnItem.bind(this, ques.get('id'))}>
                                <div className="tree-view_node">{"Options: " + ques.get('options').count()}</div>
                                <div className="tree-view_node">{self.renderProp('ordering', ques.get('ordering'))}</div>
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
