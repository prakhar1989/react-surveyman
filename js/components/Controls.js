var React = require('react');
var SurveyActions = require('../actions/SurveyActions');

var Controls = React.createClass({
    handleDownload() {
        SurveyActions.downloadSurvey();
    },
    render() {
        return (
            <div className="row controls">
                <div className="col-xs-8">
                  <span className="help-text">Survey Builder Area</span>
                  <h3>Pallet</h3>
                </div>
                <div className="col-xs-4">
                  <span className="help-text">Survey Actions</span>
                  <div className="btn-group btn-group-sm" role="group">
                      <button type="button" className="btn btn-default">
                          <span className="ion-android-cloud-done"></span> Save
                      </button>
                      <button type="button" className="btn btn-default">
                          <span className="ion-android-upload"></span> Load
                      </button>
                      <button type="button" className="btn btn-default" onClick={this.handleDownload}>
                          <span className="ion-archive"></span> Download
                      </button>
                  </div>
                </div>
            </div>
        );
    }
});

module.exports = Controls;
