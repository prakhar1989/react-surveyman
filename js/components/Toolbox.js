var React = require('react');
var { List } = require('immutable');

var DraggableBlock = require('./DraggableBlock');
var DraggableOptionGroup = require('./DraggableOptionGroup');
var DraggableQuestion = require('./DraggableQuestion');
var OptionGroup = require('./OptionGroup');
var SurveyActions = require('../actions/SurveyActions');

var Toolbox = React.createClass({
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
            <div className="toolbox">
                <h3>ToolBox</h3>
                <div className="widgets-area">
                    <DraggableBlock />
                    <DraggableQuestion />
                    <DraggableOptionGroup />
                    <h5>Choose an Option Group   <i className="ion-plus-circled" 
                        style={{cursor: 'pointer'}} onClick={this.handleAdd}></i></h5>
                    <OptionGroup 
                        options={optionGroups} 
                        selectedID={optionGroupId} />
                </div>
            </div>
        )
    }
});

module.exports = Toolbox;
