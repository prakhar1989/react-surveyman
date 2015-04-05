var React = require('react');

var HelpText = React.createClass({
    propTypes: {
        itemType: React.PropTypes.string
    },
    render() {
        return (
            <p className="help-text">Drop {this.props.itemType} here!</p>
        )
    }
});

module.exports = HelpText;
