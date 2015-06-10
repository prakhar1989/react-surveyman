var React = require('react');
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;

var ItemControl = React.createClass({
    propTypes: {
        icon: React.PropTypes.string.isRequired,
        helpText: React.PropTypes.string.isRequired,
        handleClick: React.PropTypes.func.isRequired
    },
    render() {
        var { icon, helpText, handleClick } = this.props;
        var overlay = <Tooltip>{helpText}</Tooltip>;
        return (
            <div onClick={handleClick}>
                <OverlayTrigger
                    placement='bottom'
                    overlay={overlay}>
                    <i className={icon}></i>
                </OverlayTrigger>
            </div>
        )
    }
});

module.exports = ItemControl;
