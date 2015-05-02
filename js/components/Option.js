var React = require('react');

var Option = React.createClass({
    propTypes: {
        id: React.PropTypes.number,
        otext: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            id: 0,
            otext: "I'm an option"
        }
    },
    handleEdit() {

    },
    handleDelete() {

    },
    render: function() {
        return (
            <div className="item option">
                {this.props.otext}
            </div>
        )
    }
});

module.exports = Option;
