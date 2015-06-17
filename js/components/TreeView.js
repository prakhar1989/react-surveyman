var React = require('react');
var { List } = require('immutable');
var BlockNode = require('./BlockNode');
var QuestionNode = require('./QuestionNode');
var SurveyActions = require('../actions/SurveyActions');

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
        SurveyActions.scrollToItem(id);
    },
    render() {
        var { survey } = this.props;
        var self = this;

        // build the tree
        var tree = survey.map((block, i) => {
            var questions = block.get('questions');
            var label = "Block #" +  block.get('id');
            return (
                <BlockNode key={i} label={label} handleClick={self.focusOnItem.bind(this, block.get('id'))}>

                    {questions.map((ques, j) => 
                        <QuestionNode key={j} label={self.ellipsize(ques.get('qtext'))} 
                                        handleClick={self.focusOnItem.bind(this, ques.get('id'))}>
                            <div className="tree-view_node">{"Options: " + ques.get('options').count()}</div>
                            <div className="tree-view_node">{self.renderProp('ordering', ques.get('ordering'))}</div>
                            <div className="tree-view_node">{self.renderProp('exclusive', ques.get('exclusive'))}</div>
                            <div className="tree-view_node">{self.renderProp('freetext', ques.get('freetext'))}</div>
                        </QuestionNode>
                     )}

                </BlockNode>
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
