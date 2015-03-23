var Pallet = require('./Pallet'),
    Toolbox = require('./Toolbox'),
    surveyData = require('../data');

var Application = React.createClass({
    render: function() {
        return (
            <div className="row">
                <div className="eight columns">
                    <Pallet survey={surveyData} />
                </div>
                <div className="four columns">
                    <Toolbox />
                </div>
            </div>
        )
    }
});

module.exports = Application;
