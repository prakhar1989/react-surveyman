var React = require('react');
var Alert = require('react-bootstrap').Alert;
var SurveyActions = require('../actions/SurveyActions');
var AlertTypes = require('./AlertTypes');

// Undo option is not shown for INFO alert level

var AlertBox = React.createClass({
    propTypes: {
        level: React.PropTypes.oneOf([AlertTypes.INFO,
                                      AlertTypes.WARNING,
                                      AlertTypes.SUCCESS]).isRequired,
        visible: React.PropTypes.bool.isRequired,
        msg: React.PropTypes.string.isRequired
    },
    handleUndo() {
        SurveyActions.undoSurvey();
    },
    render() {
        if (this.props.visible) {
            return (
                <Alert>
                    <p>{this.props.msg}
                    { this.props.level === AlertTypes.INFO ? '' :
                        <a onClick={this.handleUndo}>Undo</a> }
                    </p>
                </Alert>
            );
        }
        return (
            <div></div>
        );
    }
});

module.exports = AlertBox;

