var React = require('react');
var Survey = require('./Survey');
var Controls = require('./Controls');
var { List } = require('immutable');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var SurveyMan = require('../sub/surveyman.js/SurveyMan/surveyman');

var Pallet = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    survey: React.PropTypes.instanceOf(SurveyMan.survey.Survey).isRequired
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