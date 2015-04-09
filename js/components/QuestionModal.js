var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var OverlayMixin = require('react-bootstrap').OverlayMixin;
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('./ItemTypes');

// to get around the refs issues - https://github.com/react-bootstrap/react-bootstrap/issues/223
var BaseModal = React.createClass({
    propTypes: {
        parentID: React.PropTypes.number
    },
    componentDidMount() {
        var textInput = this.refs.qtext.getDOMNode();
        textInput.focus();
    },
    handleClose() {
        SurveyActions.toggleModal(ItemTypes.QUESTION);
    },
    handleSubmit() {
        var qtext = this.refs.qtext.getDOMNode().value;
        var ordering = this.refs.ordering.getDOMNode().checked;
        var freetext = this.refs.freetext.getDOMNode().checked;
        var exclusive = this.refs.exclusive.getDOMNode().checked;
        SurveyActions.questionDropped({
            parentID: this.props.parentID,
            qtext: qtext,
            ordering: ordering,
            freetext: freetext,
            exclusive: exclusive
        });
        this.handleClose();
    },
    render() {
        return <Modal title='Add Question'
            bsStyle='primary'
            backdrop={true}
            animation={true}
            container={null}
            onRequestHide={this.handleClose}>
            <div className='modal-body'>
                <div className="form-group">
                    <label htmlFor="qtext">Question Text</label>
                    <input type="text" placeholder="What is value of 4 + 5?" className="form-control" id="qtext" ref="qtext" />
                </div>
                <h5>Configuration</h5>
                <div className="checkbox">
                    <label><input type="checkbox" ref="ordering" /> Preserve ordering of the options</label>
                </div>
                <div className="checkbox">
                    <label> <input type="checkbox" ref="exclusive" /> Present options as radio-buttons (default is checkbox)</label>
                </div>
                <div className="checkbox">
                    <label> <input type="checkbox" ref="freetext"/> Allow free text entry</label>
                </div>
            </div>
            <div className='modal-footer'>
                <Button onClick={this.handleClose}>Cancel</Button>
                <Button bsStyle='primary' onClick={this.handleSubmit}>Confirm</Button>
            </div>
        </Modal>
    }
});


var QuestionModal = React.createClass({
    mixins: [OverlayMixin],
    propTypes: {
        isOpen: React.PropTypes.bool,
        parentID: React.PropTypes.number
    },
    render() {
        return (
            <div className='static-modal'> </div>
        )
    },
    renderOverlay() {
        if (!this.props.isOpen) {
            return <div></div>
        }
        return (
            <BaseModal parentID={this.props.parentID} />
        )
    }
});

module.exports = QuestionModal;