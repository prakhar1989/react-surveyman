var React = require('react');
var ReactTags = require('react-tag-input');
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('./ItemTypes');

var Options = React.createClass({
    propTypes: {
        options: React.PropTypes.array.isRequired,
        questionId: React.PropTypes.number.isRequired
    },
    handleAddition: function(otext) {
        SurveyActions.optionAdded(this.props.questionId, otext);
    },
    handleDeletion: function(index) {
        var optionId = this.props.options[index].id;
        SurveyActions.itemDelete(ItemTypes.OPTION, optionId);
    },
    handleDrag: function() {
    },
    render: function() {
        var suggestions = [];
        return (
            <ReactTags tags={this.props.options}
                    suggestions={suggestions}
                    handleAddition={this.handleAddition}
                    handleDelete={this.handleDeletion}
                    handleDrag={this.handleDrag}
                    labelField={'otext'}
                    placeholder={"Add new option"} />
        )
    }
});

module.exports = Options;
