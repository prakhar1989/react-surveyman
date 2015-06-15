var React = require('react');
var { List } = require('immutable');

var DraggableBlock = require('./DraggableBlock');
var DraggableOptionGroup = require('./DraggableOptionGroup');
var DraggableQuestion = require('./DraggableQuestion');
var OptionGroup = require('./OptionGroup');

var Toolbox = React.createClass({
    propTypes: {
        optionGroupId: React.PropTypes.number.isRequired,
        optionGroups: React.PropTypes.instanceOf(List).isRequired
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
                    <OptionGroup 
                        options={optionGroups} 
                        selectedID={optionGroupId} />
                </div>
            </div>
        )
    }
});

module.exports = Toolbox;
