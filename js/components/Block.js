var Question = require('./Question');

var Block = React.createClass({
    propTypes: {
        id: React.PropTypes.number,
        questions: React.PropTypes.array,
        subblocks: React.PropTypes.array
    },
    getDefaultProps: function() {
        return {
            id: 0,
            questions: [],
            subblocks: []
        }
    },
    render: function() {
        var questions = this.props.questions;
        return (
            <div className="item block">
                <span className="item-id">Block {this.props.id}</span>
            {questions.map(function(q) {
                return (
                    <Question options={q.options}
                        qtext={q.qtext}
                        key={q.id}
                        id={q.id} />
                )
            })}
            </div>
        )
    }
});

module.exports = Block;
