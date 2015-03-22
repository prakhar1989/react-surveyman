var Dustbin = require('./Dustbin'),
    Toolbox = require('./Toolbox');

var Container = React.createClass({
    render: function() {
        return (
            <div className="row">
                <div className="eight columns">
                    <h5>Pallet</h5>
                    <Dustbin />
                </div>
                <div className="four columns">
                    <Toolbox />
                </div>
            </div>
        )
    }
});

module.exports = Container;
