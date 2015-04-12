var React = require('react'),
    ReactDND = require('react-dnd');

var Option = require('./Option');
var ItemTypes = require('./ItemTypes');
var SurveyActions = require('../actions/SurveyActions');
var HelpText = require('./HelpText');

var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;

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
            qtext: "I'm a question",
            ordering: false,
            freetext: false,
            exclusive: false
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
                <div className="config-area">
                    <ul>
                        <li className={this.props.ordering ? 'active' : ''}>
                            <OverlayTrigger placement='bottom' overlay={<Tooltip>Toggles whether options are randomized.</Tooltip>}>
                                <i className="ion-shuffle"></i>
                            </OverlayTrigger>
                        </li>
                        <li className={this.props.exclusive ? 'active' : ''}>
                            <OverlayTrigger placement='bottom' overlay={<Tooltip>Toggles whether options appear as radio button or checkbox.</Tooltip>}>
                                <i className="ion-android-radio-button-on"></i>
                            </OverlayTrigger>
                        </li>
                        <li className={this.props.freetext ? 'active' : ''}>
                            <OverlayTrigger placement='bottom' overlay={<Tooltip>Toggles whether free text can be entered.</Tooltip>}>
                                <i className="ion-document-text"></i>
                            </OverlayTrigger>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
});

module.exports = Question;
