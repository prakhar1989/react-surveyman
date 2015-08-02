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
    handleDrop() {
        console.log("file dropped");
    },
    render() {
        return (
            <Modal title='Load Survey' bsStyle='warning' backdrop={true} 
                        animation={true} container={null} closeButton={false}
                        onRequestHide={this.handleClose}>
                <div className='modal-body'>
                    <h3>Saved Surveys</h3>
                    <p>Here are your saved surveys that we have found. Click on any to load into the pallet.</p>
                    <ul>
                        <li>saved on 14/12/1041</li>
                        <li>saved on 4/10/1041</li>
                        <li>saved on 4/2/1041</li>
                    </ul>
                    <h2><span>OR</span></h2>
                    <h3>Upload a Survey file</h3>
                     <p>Try dropping some files here, or click to select files to upload.</p>
                     <FileDropzone onDrop={this.handleDrop} className="file-dropzone">
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
        isOpen: React.PropTypes.bool,
        parentID: React.PropTypes.string
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
            <BaseModal />
        );
    }
});

module.exports = LoadSurveyModal;
