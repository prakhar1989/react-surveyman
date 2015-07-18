var React = require('react');
var Survey = require('./Survey');
var Controls = require('./Controls');
var { List } = require('immutable');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;

var Pallet = React.createClass({
    mixins: [PureRenderMixin],
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
        );
    }
});

module.exports = Pallet;
