var React = require('react');

var Dropzone = require('./Dropzone'),
    Survey = require('./Survey');

var Pallet = React.createClass({
    propTypes: {
        survey: React.PropTypes.array
    },
    getDefaultProps: function() {
        return {
            survey: []
        }
    },
    render: function() {
        return (
            <div>
                <h5>Pallet</h5>
                <div className="survey-area">
                    <Survey survey={this.props.survey} />
                </div>
            </div>
        )
    }
});

module.exports = Pallet;
