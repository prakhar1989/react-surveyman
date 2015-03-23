var Option = require('./Option');

var Question = React.createClass({
    propTypes: {
        options: React.PropTypes.array,
        id: React.PropTypes.number,
        qtext: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            options: [],
            id: 0,
            qtext: "I'm a question"
        }
    },
    render: function() {
        var options = this.props.options;
        return (
            <div className="item">{this.props.qtext}
            {options.map(function(item) {
                return (
                    <Option key={item.id} otext={item.otext} />
                )
            })}

            </div>
        )
    }
});

module.exports = Question;
