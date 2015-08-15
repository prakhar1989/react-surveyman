var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var OverlayMixin = require('react-bootstrap').OverlayMixin;
var SurveyActions = require('../actions/SurveyActions');
var FileDropzone = require('react-dropzone');

// to get around the refs issues - https://github.com/react-bootstrap/react-bootstrap/issues/223
var BaseModal = React.createClass({
    handleClose() {
        SurveyActions.toggleLoadModal();
    },
    handleDrop(files) {
        if (files.length !== 1) {
            throw new Error("Please upload a single file");
        }
        var file = files[0];
        var reader = new FileReader();
        reader.onload = (evt) => {
            try {
                var { survey } = JSON.parse(evt.target.result);
                SurveyActions.loadSurvey(survey);
                SurveyActions.toggleLoadModal();
            } catch (err) {
                alert("Unable to load survey. Please make sure you upload a " +
                      "json file in the correct format.");
                console.error(err);
            }
        };
        reader.readAsText(file, "UTF-8");
    },
    handleClick(index) {
        var { data } = this.props.savedSurveys[index];
        SurveyActions.loadSurvey(data);
        SurveyActions.toggleLoadModal();
    },
    render() {
        var { savedSurveys } = this.props;
        var saves = savedSurveys.map((s, i) =>
            <li key={i}>
                <a title={"Saved on: " + new Date(s.createdAt)}
                   onClick={this.handleClick.bind(this, i)}>
                    {s.title}
                </a>
            </li>
        );

        return (
            <Modal title='Load Survey' bsStyle='warning' backdrop={true}
                        animation={true} container={null} closeButton={false}
                        onRequestHide={this.handleClose}>
                <div className='modal-body'>
                    <h3>Saved Surveys</h3>
                    <p>Here are your saved surveys that we have found. Click on any to load into the pallet.</p>

                    {saves.length === 0 ? <p>No saved surveys found</p> : <ul> {saves} </ul>}

                    <h2><span>OR</span></h2>

                    <h3>Upload a Survey file</h3>
                     <p>Try dropping some files here, or click to select files to upload.</p>
                     <FileDropzone onDrop={this.handleDrop} multiple={false} className="file-dropzone">
                        <i className="ion-archive"></i>
                    </FileDropzone>
                </div>
                <div className='modal-footer'>
                    <Button onClick={this.handleClose}>Cancel</Button>
                </div>
            </Modal>
        );
    }
});

var LoadSurveyModal = React.createClass({
    mixins: [OverlayMixin],
    propTypes: {
        isOpen: React.PropTypes.bool.isRequired,
        savedSurveys: React.PropTypes.array.isRequired
    },
    render() {
        return (
            <div className='static-modal'> </div>
        );
    },
    renderOverlay() {
        if (!this.props.isOpen) {
            return <div></div>;
        }
        return (
            <BaseModal savedSurveys={this.props.savedSurveys} />
        );
    }
});

module.exports = LoadSurveyModal;
