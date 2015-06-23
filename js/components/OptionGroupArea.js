var React = require('react');
var OptionGroup = require('./OptionGroup');
var SurveyActions = require('../actions/SurveyActions');
var { List } = require('immutable');

var OptionGroupArea = React.createClass({
    propTypes: {
        optionGroupId: React.PropTypes.number.isRequired,
        optionGroups: React.PropTypes.instanceOf(List).isRequired
    },
    handleAdd() {
        var labels = prompt("Add new option group (comma separted)");
        var options = labels.split(',').map(l => l.trim());
        SurveyActions.addOptionGroup(options);
    },
    render: function() {
        var { optionGroupId, optionGroups } = this.props;
        return (
            <div>
                <h5>Select / Add Option Lists <i className="ion-plus-circled" 
                    style={{cursor: 'pointer'}} onClick={this.handleAdd}></i></h5>
                <OptionGroup 
                    options={optionGroups} 
                    selectedID={optionGroupId} />
            </div>
        )
    }
});

module.exports = OptionGroupArea;
