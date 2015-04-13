var React = require('react');
var Survey = require('./Survey');
var Controls = require('./Controls');

var Pallet = React.createClass({
    propTypes: {
        survey: React.PropTypes.array
    },
    render: function() {
        return (
            <div>
                <Controls />
                <div className="survey-area">
                    <Survey survey={this.props.survey} />
                </div>
            </div>
        )
    }
});

module.exports = Pallet;
