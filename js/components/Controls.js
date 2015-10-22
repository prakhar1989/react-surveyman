var React = require('react');
var SurveyActions = require('../actions/SurveyActions');
var SurveyStore = require('../stores/SurveyStore');
var SurveyMan = require('../sub/surveyman.js/SurveyMan/surveyman');

var Controls = React.createClass({
  handleDownload() {
    var data = JSON.stringify({survey: SurveyStore.getSurveyData()}, null, 2);
    var url = 'data:text/plain;charset=utf-8,' + encodeURIComponent(data);
    var link = this.refs.link.getDOMNode('link');
    link.href = url;
  },
  handleSave() {
    var title = prompt("Enter a title for the survey");
    if (title === null) {
      return;
    } else if (title.trim().length > 0) {
      SurveyActions.saveSurvey(title);
    } else {
      alert("Please enter a title");
    }
  },
  handleLoad() {
    SurveyActions.toggleLoadModal();
  },
  handleClear() {
    var choice = confirm("This will clear the survey and start a new one. " +
        "Are you sure you want to proceed?");
    if (choice) {
      SurveyActions.clearSurvey();
    }
  },
  handleRandomize() {
    let survey = SurveyStore.data.surveyData;
    let newSurvey = SurveyMan.copy_survey(survey);
    newSurvey.randomize();
    SurveyStore.updateSurveyData(newSurvey, false);
  },
  handleStaticAnalysis() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => console.log(xhttp.responseText);
    xhttp.open("POST", "http://codemonkey.cs.umass.edu:1234/analyze", false);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onload = () => {
      if (xhttp.status >= 200 && xhttp.status < 400) {
        console.log(xhttp.responseText);
      } else {
        console.log('something went wrong');
      }
    };
    let data = JSON.stringify(SurveyStore.getSurveyData());
    console.log(data);
    xhttp.send(data);
  },
  render() {
    return (
        <div className="row controls">
          <div className="col-xs-2">
            <span className="help-text">Survey Builder</span>
            <h3>Pallet</h3>
          </div>
          <div className="col-xs-10 survey-actions">
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
              <a ref="link" href='' download="survey.json" type="button" className="btn btn-default" onClick={this.handleDownload}>
                <span className="ion-archive"></span> Download
              </a>
              <button className="btn btn-default" onClick={this.handleRandomize}>Randomize Survey
              </button>
              <button className="btn btn-default" onClick={this.handleStaticAnalysis}>Run Static Analysis</button>
            </div>
          </div>
        </div>
    );
  }
});

module.exports = Controls;
