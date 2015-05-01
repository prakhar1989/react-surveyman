var React = require('react');
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;

var ToggleParam = React.createClass({
    propTypes: {
        toggleProp: React.PropTypes.bool.isRequired,
        icon: React.PropTypes.string.isRequired,
        helpText: React.PropTypes.string.isRequired
    },
    render() {
        var overlay = <Tooltip>{this.props.helpText}</Tooltip>;
        return (
            <div className={this.props.toggleProp ? 'active' : ''}>
                <OverlayTrigger
                    placement='bottom'
                    overlay={overlay}>
                    <i className={this.props.icon}></i>
                </OverlayTrigger>
            </div>
        )
    }
});

module.exports = ToggleParam;
