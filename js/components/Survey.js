var Block = require('./Block');

var Survey = React.createClass({
    propTypes: {
        survey: React.PropTypes.array
    },
    getInitialState: function() {
        return {
            survey: this.props.survey
        }
    },
    render: function() {
        var survey = this.state.survey;
        return (
            <div>
            {survey.map(function(block) {
                return (
                    <Block key={block.id}
                        id={block.id}
                        questions={block.questions} />
                )
            })}
            </div>
        )
    }
});

module.exports = Survey;
