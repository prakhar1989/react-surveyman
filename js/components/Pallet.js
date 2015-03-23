var Dropzone = require('./Dropzone');

var Pallet = React.createClass({
    render: function() {
        return (
          <div>
            <h5>Pallet</h5>
            <Dropzone />
          </div>
        )
    }
});


module.exports = Pallet;
