(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var App = require('./components/Application'),
    AppComponent = React.createFactory(App)

React.render(AppComponent(), document.getElementById('app'));



},{"./components/Application":2}],2:[function(require,module,exports){
var Pallet = require('./Pallet'),
    Toolbox = require('./Toolbox'),
    surveyData = require('../data');

var Application = React.createClass({displayName: "Application",
    render: function() {
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "eight columns"}, 
                    React.createElement(Pallet, {survey: surveyData})
                ), 
                React.createElement("div", {className: "four columns"}, 
                    React.createElement(Toolbox, null)
                )
            )
        )
    }
});

module.exports = Application;


},{"../data":13,"./Pallet":9,"./Toolbox":12}],3:[function(require,module,exports){
var Question = require('./Question');

var Block = React.createClass({displayName: "Block",
    propTypes: {
        id: React.PropTypes.number,
        questions: React.PropTypes.array,
        subblocks: React.PropTypes.array
    },
    getDefaultProps: function() {
        return {
            id: 0,
            questions: [],
            subblocks: []
        }
    },
    render: function() {
        var questions = this.props.questions;
        return (
            React.createElement("div", {className: "item block"}, 
                React.createElement("span", {className: "item-id"}, "Block ", this.props.id), 
            questions.map(function(q) {
                return (
                    React.createElement(Question, {options: q.options, 
                        qtext: q.qtext, 
                        key: q.id, 
                        id: q.id})
                )
            })
            )
        )
    }
});

module.exports = Block;


},{"./Question":10}],4:[function(require,module,exports){
var ItemTypes = require('./ItemTypes.js');

var DraggableBlock = React.createClass({displayName: "DraggableBlock",
    mixins: [ReactDND.DragDropMixin],
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.BLOCK, {
                dragSource: {
                    beginDrag: function(component) {
                        // TODO: use this to transfer data
                        return {
                            item: {
                            }
                        };
                    }
                }
            });
        }
    },
    render: function() {
        var style = {};

        var isDragging = this.getDragState(ItemTypes.BLOCK).isDragging;
        style.opacity = isDragging ? 0.4 : 1;

        return (
            React.createElement("div", React.__spread({},  this.dragSourceFor(ItemTypes.BLOCK), 
                {style: style, className: "draggable"}), 
                "Block"
            )
        )
    }
});

module.exports = DraggableBlock;


},{"./ItemTypes.js":7}],5:[function(require,module,exports){
var ItemTypes = require('./ItemTypes');

var DraggableQuestion = React.createClass({displayName: "DraggableQuestion",
    mixins: [ReactDND.DragDropMixin],
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.QUESTION, {
                dragSource: {
                    beginDrag: function(component) {
                        // TODO: use this to transfer data
                        return {
                            item: {
                            }
                        };
                    }
                }
            });
        }
    },
    render: function() {
        var style = {};
        var isDragging = this.getDragState(ItemTypes.QUESTION).isDragging;
        style.opacity = isDragging ? 0.4 : 1;

        return (
            React.createElement("div", React.__spread({},  this.dragSourceFor(ItemTypes.QUESTION), 
                {style: style, className: "draggable"}), 
                "Question"
            )
        )
    }
});

module.exports = DraggableQuestion;


},{"./ItemTypes":7}],6:[function(require,module,exports){
var ItemTypes = require('./ItemTypes.js');

var Dropzone = React.createClass({displayName: "Dropzone",
    propTypes: {
        onBlockDropped: React.PropTypes.func,
        onQuestionDropped: React.PropTypes.func,
        onOptionDropped: React.PropTypes.func
    },
    mixins: [ReactDND.DragDropMixin],
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.BLOCK, {
                dropTarget: {
                    acceptDrop: function(component, item) {
                        component.handleBlockDrop();
                    }
                }
            });

            register(ItemTypes.QUESTION, {
                dropTarget: {
                    acceptDrop: function(component, item) {
                        component.handleQuestionDrop();
                    }
                }
            })
        }
    },
    handleBlockDrop: function() {
        this.props.onBlockDropped();
    },
    handleQuestionDrop: function() {
        this.props.onQuestionDropped();
    },
    render: function() {
        var style = {},
            blockDropState = this.getDropState(ItemTypes.BLOCK),
            questionDropState = this.getDropState(ItemTypes.QUESTION),
            isHovering = blockDropState.isHovering || questionDropState.isHovering,
            isDragging = blockDropState.isDragging || questionDropState.isDragging,
            backgroundColor;

        if (isHovering) {
            backgroundColor = '#CAD2C5';
        } else if (isDragging) {
            backgroundColor = '#52796F';
        }
        style.backgroundColor = backgroundColor;

        // define a set of item types the dropzone accepts
        var accepts = [ItemTypes.BLOCK, ItemTypes.QUESTION];

        return (
            React.createElement("div", React.__spread({},  this.dropTargetFor.apply(this, accepts), 
                {style: style, 
                className: "dropzone"}), 
            isHovering ? 'Release to drop' : 'Drag item here'
            )
        )
    }
});

module.exports = Dropzone;


},{"./ItemTypes.js":7}],7:[function(require,module,exports){
var ItemTypes = {
    BLOCK: 'block',
    QUESTION: 'question',
    OPTION: 'option'
};

module.exports = ItemTypes;


},{}],8:[function(require,module,exports){
var Option = React.createClass({displayName: "Option",
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
    render: function() {
        return (
            React.createElement("div", {className: "item option"}, 
                this.props.otext
            )
        )
    }
});

module.exports = Option;


},{}],9:[function(require,module,exports){
var Dropzone = require('./Dropzone'),
    Survey = require('./Survey');

var Pallet = React.createClass({displayName: "Pallet",
    propTypes: {
        survey: React.PropTypes.array
    },
    getDefaultProps: function() {
        return {
            survey: []
        }
    },
    getInitialState: function() {
        return {
            survey: this.props.survey,
            nextBlockId: this.props.survey.length
        }
    },
    getNewBlock: function(block) {
        // generates a block JS object
        return {
            id: block.id,
            questions: [],
            subblocks: []
        }
    },
    getNewQuestionId: function() {
        // TODO: Refer to java code for ID generation
        return Math.floor((Math.random() * 1000) + 1);
    },
    getNewQuestion: function(question) {
        var id = this.getNewQuestionId();
        return {
            id: id,
            options: [],
            qtext: question.qtext
        }
    },
    handleBlockDrop: function() {
        // this is where the new block is added
        var survey = this.state.survey,
            newId = this.state.nextBlockId + 1,
            newBlock = this.getNewBlock({id: newId}),
            newSurvey = survey.concat(newBlock);

        //  and state is updated with new block
        this.setState({
            survey: newSurvey,
            nextBlockId: newId
        });

        // TODO: better alerts
        console.log("new block added");
    },
    handleQuestionDrop: function() {
        // for now, we just add the question to the last block
        var survey = this.state.survey,
            block = survey[survey.length - 1];

        var qtext = prompt("Enter question text");
        if (qtext == undefined) {
            return;
        }
        var newQuestion = this.getNewQuestion({qtext: qtext});
        block.questions = block.questions.concat(newQuestion);

        survey[survey.length - 1] = block;
        this.setState({
            survey: survey
        });
        console.log("New question added");
    },
    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement("h5", null, "Pallet"), 
                React.createElement(Dropzone, {onBlockDropped: this.handleBlockDrop, 
                          onQuestionDropped: this.handleQuestionDrop}), 
                React.createElement("hr", null), 

                React.createElement("h5", null, "Survey"), 
                React.createElement("div", {className: "survey-area"}, 
                    React.createElement(Survey, {survey: this.state.survey})
                )
            )
        )
    }
});

module.exports = Pallet;


},{"./Dropzone":6,"./Survey":11}],10:[function(require,module,exports){
var Option = require('./Option');

var Question = React.createClass({displayName: "Question",
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
            React.createElement("div", {className: "item question"}, this.props.qtext, 
                React.createElement("div", null, 
                options.map(function(item) {
                    return (
                        React.createElement(Option, {key: item.id, otext: item.otext})
                    )
                })
                )
            )
        )
    }
});

module.exports = Question;


},{"./Option":8}],11:[function(require,module,exports){
var Block = require('./Block');

var Survey = React.createClass({displayName: "Survey",
    propTypes: {
        survey: React.PropTypes.array.isRequired
    },
    render: function() {
        var survey = this.props.survey;
        return (
            React.createElement("div", null, 
            survey.map(function(block) {
                return (
                    React.createElement(Block, {key: block.id, 
                        id: block.id, 
                        questions: block.questions})
                )
            })
            )
        )
    }
});

module.exports = Survey;


},{"./Block":3}],12:[function(require,module,exports){
var DraggableBlock = require('./DraggableBlock'),
    DraggableQuestion = require('./DraggableQuestion');

var Toolbox = React.createClass({displayName: "Toolbox",
    render: function() {
        return (
            React.createElement("div", {className: "toolbox"}, 
                React.createElement("h5", null, "ToolBox"), 
                React.createElement("small", null, "Drag new elements from here"), 
                React.createElement("div", {className: "widgets-area"}, 
                    React.createElement(DraggableBlock, null), 
                    React.createElement(DraggableQuestion, null)
                )
            )
        )
    }
});

module.exports = Toolbox;


},{"./DraggableBlock":4,"./DraggableQuestion":5}],13:[function(require,module,exports){
/* Test data to work with */
var data = [
    {   // first block
        id: 1,
        randomizable: true,
        questions: [
            {
                id: 143,
                qtext: "Do you live in the US?",
                options: [
                    { id: 124, otext: "Yes" },
                    { id: 224, otext: "No" }
                ]
            },
            {
                id: 413,
                qtext: "Gender?",
                options: [
                    { id: 540, otext: "Male" },
                    { id: 405, otext: "Female" },
                    { id: 449, otext: "Other" }
                ]
            }
        ]
    },
    {   // second block
        id: 2,
        questions: [
            {
                id: 143,
                qtext: "Which of the following is a 5 letter word?",
                options: [
                    { id: 14, otext: "Orange" },
                    { id: 24, otext: "Banana" },
                    { id: 99, otext: "Apple"},
                    { id: 93, otext: "Peach"}
                ]
            }
        ]
    }
];


module.exports = data;


},{}]},{},[1]);
