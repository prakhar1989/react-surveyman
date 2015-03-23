var Block = require('./Block');

var Survey = React.createClass({
    propTypes: {
        survey: React.PropTypes.array.isRequired
    },
    render: function() {
        var survey = this.props.survey;
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
