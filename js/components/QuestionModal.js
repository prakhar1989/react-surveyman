var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var OverlayMixin = require('react-bootstrap').OverlayMixin;
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('./ItemTypes');

var QuestionModal = React.createClass({
    mixins: [OverlayMixin],
    propTypes: {
        isOpen: React.PropTypes.bool
    },
    handleClose() {
        SurveyActions.toggleModal(ItemTypes.QUESTION);
    },
    handleSubmit() {
        console.log("data submitted");
        this.handleClose();
    },
    render() {
        return (
            <div className='static-modal'>
            </div>
        )
    },
    renderOverlay() {
        if (!this.props.isOpen) {
            return <div></div>
        }
        return (
            <Modal title='Add Question'
                bsStyle='primary'
                backdrop={true}
                animation={true}
                container={null}
                onRequestHide={this.handleClose}>
                <div className='modal-body'> Add a Question </div>
                <div className='modal-footer'>
                    <Button onClick={this.handleClose}>Cancel</Button>
                    <Button bsStyle='primary' onClick={this.handleSubmit}>Confirm</Button>
                </div>
            </Modal>
        )
    }
});

module.exports = QuestionModal;