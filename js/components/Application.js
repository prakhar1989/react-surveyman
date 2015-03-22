var Dustbin = require('./Dustbin'),
    Item = require('./Item');

var Container = React.createClass({
    render: function() {
        return (
            <div>
                <Dustbin />
                <div>
                    <Item name='Glass' />
                    <Item name='Paper' />
                    <Item name='Banana' />
                </div>
            </div>
        )
    }
});

module.exports = Container;
