var Pallet = require('./Pallet'),
    Toolbox = require('./Toolbox');

var Container = React.createClass({
    render: function() {
        return (
            <div className="row">
                <div className="eight columns">
                    <Pallet />
                </div>
                <div className="four columns">
                    <Toolbox />
                </div>
            </div>
        )
    }
});

module.exports = Container;
