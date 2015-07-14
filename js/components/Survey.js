var React = require('react');
var Block = require('./Block');
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('./ItemTypes');
var HelpText = require('./HelpText');
var { List } = require('immutable');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var cx = require('classnames');
var { DropTarget } = require('react-dnd');
var ReactCSSTransitionGroup = require('react/addons').addons.CSSTransitionGroup;

var surveyTarget = {
    drop(props, monitor, component) {
        let droppedOnChild = !monitor.isOver({ shallow: true });
        if (!droppedOnChild) {
            component.handleBlockDrop();
        }
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOverCurrent: monitor.isOver({ shallow: true })
    };
}

function renderSubblocks(block) {
    var subblocks = block.get('subblocks');
    if (subblocks.count() > 0) {
        return subblocks.map((subb, i) =>
          <Block key={subb.get('id')}
                 id={subb.get('id')}
                 isFirst={i === 0}
                 subblocks={subb.get('subblocks')}
                 randomize={subb.get('randomize')}
                 questions={subb.get('questions')}>
                   {renderSubblocks(subb)}
          </Block>
        );
    }
}

var Survey = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        survey: React.PropTypes.instanceOf(List)
    },
    handleBlockDrop() {
        SurveyActions.blockDropped();
    },
    render() {
        var { survey, isOverCurrent, connectDropTarget } = this.props;

        var classes = cx({
            'survey': true,
            'dragging': isOverCurrent,
            'hovering': isOverCurrent
        });

        var blocks = survey.map((block, i) => {
            return (
              <Block key={block.get('id')}
                  id={block.get('id')}
                  isFirst={i === 0}
                  subblocks={block.get('subblocks')}
                  randomize={block.get('randomize')}
                  questions={block.get('questions')}>
                    {renderSubblocks(block)}
              </Block>
            );
        });

        // wrapping the blocks in a react transition group
        var blockAnimationTag = (
            <ReactCSSTransitionGroup transitionName="itemTransition" transitionEnter={false}>
                { blocks }
            </ReactCSSTransitionGroup>
        );

        return connectDropTarget(
            <div className={classes}>
                 { survey.count() > 0 ? blockAnimationTag : <HelpText itemType="Block" /> }
            </div>
        );
    }
});

module.exports = DropTarget(ItemTypes.BLOCK, surveyTarget, collect)(Survey);
