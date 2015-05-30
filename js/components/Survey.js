var React = require('react');
var ReactDND = require('react-dnd');
var Block = require('./Block');
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('./ItemTypes');
var HelpText = require('./HelpText');
var { List } = require('immutable');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var cx = require('classnames');

var Survey = React.createClass({
    mixins:[ReactDND.DragDropMixin, PureRenderMixin],
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.BLOCK, {
                dropTarget: {
                    acceptDrop: function(component, item) {
                        component.handleBlockDrop();
                    }
                }
            })
        }
    },
    propTypes: {
        survey: React.PropTypes.instanceOf(List)
    },
    handleBlockDrop() {
        SurveyActions.blockDropped();
    },
    render: function() {
        var survey = this.props.survey;
        var dropState = this.getDropState(ItemTypes.BLOCK);
        var classes = cx({
            'survey': true,
            'dragging': dropState.isDragging,
            'hovering': dropState.isHovering
        });


        var blocks = survey.map(block =>
            <Block key={block.get('id')}
                id={block.get('id')}
                subblocks={[]}
                ordering={block.get('ordering')}
                randomizable={block.get('randomizable')}
                questions={block.get('questions')} />
        );

        return (
            <div className={classes} {...this.dropTargetFor(ItemTypes.BLOCK)}>
                 { survey.count() > 0 ? blocks : <HelpText itemType="Block" /> }
            </div>
        )
    }
});

module.exports = Survey;
