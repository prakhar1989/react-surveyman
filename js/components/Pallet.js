var React = require('react');
var Survey = require('./Survey');

var Pallet = React.createClass({
    propTypes: {
        survey: React.PropTypes.array
    },
    render: function() {
        return (
            <div>
                <h3>Pallet</h3>
                <div className="survey-area">
                    <Survey survey={this.props.survey} />
                </div>
            </div>
        )
    }
});

module.exports = Pallet;
