var React = require('react');
var ItemTypes = require('./ItemTypes');
var Question = require('./Question');
var SurveyActions = require('../actions/SurveyActions');
var HelpText = require('./HelpText');
var ToggleParam = require('./ToggleParam');
var flow = require('lodash/function/flow');
var { List } = require('immutable');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var cx = require('classnames');
var { DropTarget } = require('react-dnd');
var ItemControl = require('./ItemControl');
var ReactCSSTransitionGroup = require('react/addons').addons.CSSTransitionGroup;

var blockTarget = {
    drop(props, monitor) {
        let droppedOnChild = !monitor.isOver({shallow: false});
        if (!droppedOnChild) {
          SurveyActions.blockDropped(props.id);
        }
    }
};

function blockCollect(connect, monitor) {
    return {
        connectBlockDropTarget: connect.dropTarget(),
        isBlockOver: monitor.isOver({shallow: true})
    }
}

var questionTarget = {
    drop(props, monitor) {
        let droppedOnChild = !monitor.isOver({shallow: false});
        if (!droppedOnChild) {
            SurveyActions.toggleModal(ItemTypes.QUESTION, props.id);
        }
    }
}

function questionCollect(connect, monitor) {
    return {
        connectQuestionDropTarget: connect.dropTarget(),
        isQuestionOver: monitor.isOver(),
        isOverChild: monitor.isOver({shallow: true})
    }
}

var Block = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        id: React.PropTypes.string.isRequired,
        questions: React.PropTypes.instanceOf(List).isRequired,
        subblocks: React.PropTypes.instanceOf(List).isRequired,
        randomize: React.PropTypes.bool.isRequired
    },
    handleQuestionDrop() {
        SurveyActions.toggleModal(ItemTypes.QUESTION, this.props.id);
    },
    handleDelete() {
        var deleteConfirmation = confirm("Are you sure you want to delete this block, its associated questions and options?");
        if (deleteConfirmation) {
            SurveyActions.itemDelete(ItemTypes.BLOCK, this.props.id);
        }
    },
    handleCopy(e) {
        SurveyActions.itemCopy(ItemTypes.BLOCK, this.props.id);
    },
    render() {
        var { isQuestionOver,
              isBlockOver,
              isOverChild,
              connectQuestionDropTarget,
              connectBlockDropTarget,
              subblocks } = this.props;

        var classes = cx({
            'item block': true,
            'hovering': (isQuestionOver && !isOverChild) || isBlockOver
        });

        // render questions
        var questions = this.props.questions.map(q =>
            <Question key={q.get('id')}
                options={q.get('options')}
                id={q.get('id')}
                qtext={q.get('qtext')}
                ordering={q.get('ordering')}
                exclusive={q.get('exclusive')}
                freetext={q.get('freetext')} />
        );

        // wrapping the questions in a react transition group
        var questionAnimationTag = (
            <ReactCSSTransitionGroup transitionName="itemTransition" transitionEnter={false}>
                { questions }
            </ReactCSSTransitionGroup>
        );
        var help = subblocks.count() > 0 ? null : <HelpText itemType="Question" />;

        return connectBlockDropTarget(connectQuestionDropTarget(
            <div className={classes} id={this.props.id}>
                <div className="controls-area">
                    <ul>
                      <li><ItemControl icon="ion-trash-b" helpText="Delete this block" handleClick={this.handleDelete}/></li>
                      <li><ItemControl icon="ion-plus-circled" helpText="Add a question" handleClick={this.handleQuestionDrop}/></li>
                      <li><ItemControl icon="ion-ios-copy" helpText="Clone this block" handleClick={this.handleCopy}/></li>
                    </ul>
                </div>

                { questions.count() > 0 ? questionAnimationTag :  help }

                { this.props.children }

                <div className="config-area">
                    <ul>
                        <li>
                            <ToggleParam
                                icon="ion-shuffle"
                                helpText="Toggles whether questions will be randomized"
                                toggleValue={this.props.randomize}
                                toggleName='randomize'
                                itemType={ItemTypes.BLOCK}
                                itemId={this.props.id} />
                        </li>
                    </ul>
                </div>
            </div>
        ))
    }
});

module.exports = flow(
  DropTarget(ItemTypes.QUESTION, questionTarget, questionCollect),
  DropTarget(ItemTypes.BLOCK, blockTarget, blockCollect)
)(Block);
