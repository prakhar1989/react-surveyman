var React = require('react');
var Block = require('./Block');
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('./ItemTypes');
var HelpText = require('./HelpText');
var { List } = require('immutable');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var cx = require('classnames');
var { DropTarget } = require('react-dnd');

var surveyTarget = {
    drop(props, monitor, component) {
        component.handleBlockDrop();
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver()
    }
}

var Survey = React.createClass({
    mixins:[PureRenderMixin],
    propTypes: {
        survey: React.PropTypes.instanceOf(List)
    },
    handleBlockDrop() {
        SurveyActions.blockDropped();
    },
    render() {
        var { survey, canDrop, isOver, connectDropTarget } = this.props;
        var classes = cx({
            'survey': true,
            'dragging': canDrop,
            'hovering': isOver
        });

        var blocks = survey.map(block =>
            <Block key={block.get('id')}
                id={block.get('id')}
                subblocks={[]}
                ordering={block.get('ordering')}
                randomizable={block.get('randomizable')}
                questions={block.get('questions')} />
        );

        return connectDropTarget(
            <div className={classes}>
                 { survey.count() > 0 ? blocks : <HelpText itemType="Block" /> }
            </div>
        )
    }
});

module.exports = DropTarget(ItemTypes.BLOCK, surveyTarget, collect)(Survey);
