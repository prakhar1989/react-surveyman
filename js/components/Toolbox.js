var DraggableBlock = require('./DraggableBlock');

var Toolbox = React.createClass({
    render: function() {
        return (
            <div className="toolbox">
                <h5>ToolBox</h5>
                <DraggableBlock />
            </div>
        )
    }
});

module.exports = Toolbox;
