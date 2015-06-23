var React = require('react');
var { List } = require('immutable');
var DraggableBlock = require('./DraggableBlock');
var DraggableOptionGroup = require('./DraggableOptionGroup');
var DraggableQuestion = require('./DraggableQuestion');
var OptionGroupArea = require('./OptionGroupArea');

var Toolbox = React.createClass({
    propTypes: {
        optionGroupId: React.PropTypes.number.isRequired,
        optionGroups: React.PropTypes.instanceOf(List).isRequired
    },
    render: function() {
        var { optionGroupId, optionGroups } = this.props;
        return (
            <div className="toolbox">
                <h3>ToolBox <span className="help-text">Drop items on the pallet</span></h3>
                <div className="widgets-area">
                    <DraggableBlock />
                    <DraggableQuestion />
                    <DraggableOptionGroup />
                    <OptionGroupArea 
                        optionGroupId={optionGroupId}
                        optionGroups={optionGroups} />
                </div>
            </div>
        )
    }
});

module.exports = Toolbox;
