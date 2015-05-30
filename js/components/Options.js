var React = require('react');
var ReactTags = require('react-tag-input');
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('./ItemTypes');
var SurveyStore = require('../stores/SurveyStore');
var { List } = require('immutable');

var Options = React.createClass({
    propTypes: {
        options: React.PropTypes.instanceOf(List).isRequired,
        questionId: React.PropTypes.string.isRequired
    },
    getInitialState: function() {
        return {
            suggestions: []
        }
    },
    componentDidMount: function() {
        var optionSet = SurveyStore.getOptionsSet();
        this.setState({ suggestions: Array.from(optionSet) });
    },
    handleAddition: function(otext) {
        SurveyActions.optionAdded(this.props.questionId, otext);
    },
    handleDeletion: function(index) {
        var id = this.props.options.getIn([index, 'id']);
        SurveyActions.itemDelete(ItemTypes.OPTION, id);
    },
    handleDrag: function() {
    },
    render: function() {
        var options = this.props.options.toJS();
        return (
            <ReactTags tags={options}
                    suggestions={this.state.suggestions}
                    handleAddition={this.handleAddition}
                    handleDelete={this.handleDeletion}
                    handleDrag={this.handleDrag}
                    labelField={'otext'}
                    placeholder={"Add new option"} />
        )
    }
});

module.exports = Options;
