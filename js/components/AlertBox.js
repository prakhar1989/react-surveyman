var React = require('react');
var Alert = require('react-bootstrap').Alert;

var AlertBox = React.createClass({
    propTypes: {
        level: React.PropTypes.string.isRequired,
        visible: React.PropTypes.bool.isRequired,
        msg: React.PropTypes.string.isRequired
    },
    render() {
        if (this.props.visible) {
            return (
                <Alert bsStyle={this.props.level}>
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

