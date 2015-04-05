var React = require('react'),
    ReactDND = require('react-dnd');

var Option = require('./Option');
var ItemTypes = require('./ItemTypes');
var SurveyActions = require('../actions/SurveyActions');

var Question = React.createClass({
    mixins: [ReactDND.DragDropMixin],
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.OPTION, {
                dropTarget: {
                    acceptDrop: function(component, item) {
                        component.handleOptionDrop();
                    }
                }
            })
        }
    },
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
    handleOptionDrop() {
        SurveyActions.optionDropped(this.props.id);
    },
    render: function() {
        var options = this.props.options;

        var dropState = this.getDropState(ItemTypes.OPTION);
        var style = {};
        if (dropState.isHovering) {
            style.backgroundColor = 'green';
        } else if (dropState.isDragging) {
            style.backgroundColor = "yellow";
        }

        return (
            <div className="item question"
                style={style}
                {...this.dropTargetFor(ItemTypes.OPTION)}> {this.props.qtext}
                <div>
                {options.map(function(item) {
                    return (
                        <Option key={item.id} otext={item.otext} />
                    )
                })}
                </div>
            </div>
        )
    }
});

module.exports = Question;
