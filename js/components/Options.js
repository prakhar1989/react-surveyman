var React = require('react');
var Tags = require('react-tag-input').WithOutContext;
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('./ItemTypes');
var SurveyStore = require('../stores/SurveyStore');
var { List } = require('immutable');
var SurveyMan = require('../sub/surveyman.js/SurveyMan/surveyman');

var Options = React.createClass({
  propTypes: {
    options: React.PropTypes.array.isRequired,
    questionId: React.PropTypes.string.isRequired
  },
  getInitialState: function() {
    return {
      suggestions: []
    };
  },
  componentDidMount: function() {
    var optionSet = SurveyStore.getOptionsSet();
    this.setState({ suggestions: Array.from(optionSet) });
  },
  handleAddition: function(otext) {
    SurveyActions.optionAdded(this.props.questionId, otext);
  },
  handleDeletion: function(index) {
    var id = this.props.options[index].id;
    SurveyActions.itemDelete(ItemTypes.OPTION, id);
  },
  handleDrag: function() {
    // TODO: to be implemented
  },
  render: function() {
    var options = this.props.options.map((o) => o.toJSON());
    return (
        <Tags tags={options}
              suggestions={this.state.suggestions}
              handleAddition={this.handleAddition}
              handleDelete={this.handleDeletion}
              handleDrag={this.handleDrag}
              labelField={'otext'}
              placeholder={"Add new option"} />
    );
  }
});

module.exports = Options;
