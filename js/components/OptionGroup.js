var React = require('react');
var { List } = require('immutable');

var OptionGroup = React.createClass({
    propTypes: {
        options: React.PropTypes.instanceOf(List).isRequired,
        selectedID: React.PropTypes.number.isRequired
    },
    render() {
        return <h4>{ this.props.selectedID }</h4>
    }
});

module.exports = OptionGroup;
