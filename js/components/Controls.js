var React = require('react');
var SurveyActions = require('../actions/SurveyActions');

var Controls = React.createClass({
    handleDownload() {
        SurveyActions.downloadSurvey();
    },
    render() {
        return (
            <div className="row controls">
                <div className="col-xs-9">
                  <h3>Pallet</h3>
                </div>
                <div className="col-xs-3">
                  <button
                        className="btn btn-success btn-sm"
                        onClick={this.handleDownload}>
                      <span className="ion-arrow-down-a"></span> Download
                  </button>
                </div>
            </div>
        );
    }
});

module.exports = Controls;
