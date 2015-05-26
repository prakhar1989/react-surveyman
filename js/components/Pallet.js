var React = require('react');
var Survey = require('./Survey');
var Controls = require('./Controls');
var { List } = require('immutable');

var Pallet = React.createClass({
    propTypes: {
        survey: React.PropTypes.instanceOf(List)
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
