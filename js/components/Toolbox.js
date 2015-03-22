var Block = require('./Item');

var Toolbox = React.createClass({
    render: function() {
        return (
            <div className="toolbox">
                <h5>ToolBox</h5>
                <Block name='Block #212' />
            </div>
        )
    }
});

module.exports = Toolbox;
