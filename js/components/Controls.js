var React = require('react');
var SurveyActions = require('../actions/SurveyActions');

var Controls = React.createClass({
    handleDownload() {
        SurveyActions.downloadSurvey();
    },
    handleSave() {
        SurveyActions.saveSurvey();
    },
    handleLoad() {
        var choice = confirm("This will cause your current state to be replaced " +
                             "with the loaded survey. Are you sure you want to proceed?");
        if (choice) {
            SurveyActions.loadSurvey();
        }
    },
    handleClear() {
        var choice = confirm("This will clear the survey and start a new one. " +
                             "Are you sure you want to proceed?");
        if (choice) {
            SurveyActions.clearSurvey();
        }
    },
    render() {
        return (
            <div className="row controls">
                <div className="col-xs-6">
                  <span className="help-text">Survey Builder Area</span>
                  <h3>Pallet</h3>
                </div>
                <div className="col-xs-6 survey-actions">
                  <p className="help-text">Survey Actions</p>
                  <div className="btn-group btn-group-sm" role="group">
                      <button type="button" className="btn btn-default" onClick={this.handleClear}>
                          <span className="ion-plus-circled"></span> New
                      </button>
                      <button type="button" className="btn btn-default" onClick={this.handleSave}>
                          <span className="ion-android-cloud-done"></span> Save
                      </button>
                      <button type="button" className="btn btn-default" onClick={this.handleLoad}>
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
