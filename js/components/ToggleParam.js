var React = require('react');
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;
var SurveyActions = require('../actions/SurveyActions');

var ToggleParam = React.createClass({
    propTypes: {
        toggleValue: React.PropTypes.bool.isRequired,
        icon: React.PropTypes.string.isRequired,
        helpText: React.PropTypes.string.isRequired,
        toggleName: React.PropTypes.string.isRequired,
        itemType: React.PropTypes.string.isRequired,
        itemId: React.PropTypes.number.isRequired
    },
    handleClick() {
        SurveyActions.toggleParam(
            this.props.itemType,
            this.props.itemId,
            this.props.toggleName
        );
    },
    render() {
        var overlay = <Tooltip>{this.props.helpText}</Tooltip>;
        return (
            <div className={this.props.toggleValue ? 'active' : ''}
                onClick={this.handleClick}>
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
