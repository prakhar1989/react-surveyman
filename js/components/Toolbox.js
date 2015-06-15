var React = require('react');
var { List } = require('immutable');

var DraggableBlock = require('./DraggableBlock'),
    DraggableOptionGroup = require('./DraggableOptionGroup'),
    DraggableQuestion = require('./DraggableQuestion');

var Toolbox = React.createClass({
    propTypes: {
        optionGroups: React.PropTypes.instanceOf(List).isRequired
    },
    render: function() {
        return (
            <div className="toolbox">
                <h3>ToolBox</h3>
                <div className="widgets-area">
                    <DraggableBlock />
                    <DraggableQuestion />
                    <DraggableOptionGroup />
                </div>
            </div>
        )
    }
});

module.exports = Toolbox;
