var React = require('react');
var Alert = require('react-bootstrap').Alert;
var SurveyActions = require('../actions/SurveyActions');

var AlertBox = React.createClass({
    propTypes: {
        level: React.PropTypes.string,
        visible: React.PropTypes.bool,
        msg: React.PropTypes.string.isRequired
    },
    getDefaultProps: function() {
        return {
            visible: true,
            level: 'info'
        }
    },
    componentDidMount: function() {
        setTimeout(function() {
            console.log("hello world")
        }, 6000);
    },
    render: function() {
        if (this.props.visible) {
            return (
                <Alert bsStyle={this.props.level} onDismiss={null} dismissAfter={2000}>
                    <p>{this.props.msg}</p>
                </Alert>
            );
        }
        return (
            <div></div>
        )
    }
});

module.exports = AlertBox;
