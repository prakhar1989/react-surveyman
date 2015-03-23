var DraggableBlock = require('./DraggableBlock');

var Toolbox = React.createClass({
    render: function() {
        return (
            <div className="toolbox">
                <h5>ToolBox</h5>
                <small>Drag new elements from here</small>
                <div className="widgets-area">
                    <DraggableBlock />
                </div>
            </div>
        )
    }
});

module.exports = Toolbox;
