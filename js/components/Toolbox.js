var React = require('react');

var DraggableBlock = require('./DraggableBlock'),
    DraggableOptionGroup = require('./DraggableOptionGroup'),
    DraggableQuestion = require('./DraggableQuestion');

var Toolbox = React.createClass({
    shouldComponentUdpate() {
        return false;
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
