(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var App = require('./components/Application'),
    AppComponent = React.createFactory(App)

React.render(AppComponent(), document.getElementById('app'));



},{"./components/Application":2}],2:[function(require,module,exports){
var Pallet = require('./Pallet'),
    Toolbox = require('./Toolbox'),
    surveyData = require('../data');

var Container = React.createClass({displayName: "Container",
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

module.exports = Container;


},{"../data":12,"./Pallet":8,"./Toolbox":11}],3:[function(require,module,exports){
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


},{"./Question":9}],4:[function(require,module,exports){
var ItemTypes = require('./ItemTypes.js');

var DraggableBlock = React.createClass({displayName: "DraggableBlock",
    mixins: [ReactDND.DragDropMixin],
    getDefaultProps: function() {
        return {
            itemId: 0
        }
    },
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.BLOCK, {
                dragSource: {
                    beginDrag: function(component) {
                        return {
                            item: {
                                itemId: component.props.itemId
                            }
                        };
                    }
                }
            });
        }
    },
    propTypes: {
        itemId: React.PropTypes.number
    },
    render: function() {
        var style = {};

        var isDragging = this.getDragState(ItemTypes.BLOCK).isDragging;
        style.opacity = isDragging ? 0.4 : 1;

        return (
            React.createElement("div", React.__spread({},  this.dragSourceFor(ItemTypes.BLOCK), 
                {style: style, className: "draggable-block"}), 
                "Block"
            )
        )
    }
});

module.exports = DraggableBlock;


},{"./ItemTypes.js":6}],5:[function(require,module,exports){
var ItemTypes = require('./ItemTypes.js');

var Dropzone = React.createClass({displayName: "Dropzone",
    mixins: [ReactDND.DragDropMixin],
    getInitialState: function() {
        return {
            survey: [],
            newBlockId: 1
        }
    },
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.BLOCK, {
                dropTarget: {
                    acceptDrop: function(component, item) {
                        component.incrementBlockId();
                    }
                }
            })
        }
    },
    incrementBlockId: function() {
        console.log("i'm being called");
        this.setState({
            newBlockId: this.state.newBlockId + 1
        });
    },
    render: function() {
        var style = {};

        var dropState = this.getDropState(ItemTypes.BLOCK),
            backgroundColor;

        if (dropState.isHovering) {
            backgroundColor = '#CAD2C5';
        } else if (dropState.isDragging) {
            backgroundColor = '#52796F';
        }
        style.backgroundColor = backgroundColor;

        return (
            React.createElement("div", React.__spread({},  this.dropTargetFor(ItemTypes.BLOCK), 
                {style: style, 
                className: "dropzone"}), 
            dropState.isHovering ? 'Release to drop' : 'Drag item here'
            )
        )
    }
});

module.exports = Dropzone;


},{"./ItemTypes.js":6}],6:[function(require,module,exports){
var ItemTypes = {
    BLOCK: 'block',
    QUESTION: 'question',
    OPTION: 'option'
};

module.exports = ItemTypes;


},{}],7:[function(require,module,exports){
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


},{}],8:[function(require,module,exports){
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
    render: function() {
        var surveyObj = this.props.survey;
        return (
            React.createElement("div", null, 
                React.createElement("h5", null, "Pallet"), 
                React.createElement(Dropzone, null), 
                React.createElement("hr", null), 

                React.createElement("h5", null, "Survey"), 
                React.createElement("div", {className: "survey-area"}, 
                    React.createElement(Survey, {survey: surveyObj})
                )
            )
        )
    }
});

module.exports = Pallet;


},{"./Dropzone":5,"./Survey":10}],9:[function(require,module,exports){
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


},{"./Option":7}],10:[function(require,module,exports){
var Block = require('./Block');

var Survey = React.createClass({displayName: "Survey",
    propTypes: {
        survey: React.PropTypes.array
    },
    getInitialState: function() {
        return {
            survey: this.props.survey
        }
    },
    render: function() {
        var survey = this.state.survey;
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


},{"./Block":3}],11:[function(require,module,exports){
var DraggableBlock = require('./DraggableBlock');

var Toolbox = React.createClass({displayName: "Toolbox",
    render: function() {
        return (
            React.createElement("div", {className: "toolbox"}, 
                React.createElement("h5", null, "ToolBox"), 
                React.createElement("small", null, "Drag new elements from here"), 
                React.createElement("div", {className: "widgets-area"}, 
                    React.createElement(DraggableBlock, null)
                )
            )
        )
    }
});

module.exports = Toolbox;


},{"./DraggableBlock":4}],12:[function(require,module,exports){
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
