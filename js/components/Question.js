var React = require('react'),
    ReactDND = require('react-dnd');

var Option = require('./Option');
var ItemTypes = require('./ItemTypes');
var SurveyActions = require('../actions/SurveyActions');
var HelpText = require('./HelpText');

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
        var options = this.props.options.map(op => {
            return <Option key={op.id} otext={op.otext} />
        });

        var dropState = this.getDropState(ItemTypes.OPTION);
        var style = {};
        if (dropState.isHovering) {
            style.backgroundColor = '#f4fbd7';
        } else if (dropState.isDragging) {
            style.backgroundColor = "#eeeeee";
        }

        return (
            <div className="item question"
                style={style}
                {...this.dropTargetFor(ItemTypes.OPTION)}>
                <div className="qtext"> {this.props.qtext} </div>
                <div>
                {options.length > 0 ? options : <HelpText itemType="Option" />}
                </div>
            </div>
        )
    }
});

module.exports = Question;
