(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var App = require('./components/Application');
var AppComponent = React.createFactory(App);

React.render(AppComponent(), document.getElementById('app'));



},{"./components/Application":2}],2:[function(require,module,exports){
var Dustbin = require('./Dustbin'),
    Toolbox = require('./Toolbox');

var Container = React.createClass({displayName: "Container",
    render: function() {
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "eight columns"}, 
                    React.createElement("h5", null, "Pallet"), 
                    React.createElement(Dustbin, null)
                ), 
                React.createElement("div", {className: "four columns"}, 
                    React.createElement(Toolbox, null)
                )
            )
        )
    }
});

module.exports = Container;


},{"./Dustbin":3,"./Toolbox":6}],3:[function(require,module,exports){
var ItemTypes = require('./ItemTypes.js');

var Dustbin = React.createClass({displayName: "Dustbin",
    mixins: [ReactDND.DragDropMixin],
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.ITEM, {
                dropTarget: {
                    acceptDrop: function(component, item) {
                        window.alert('You dropped ' + item.name + '!');
                    }
                }
            })
        }
    },
    render: function() {
        var style = {};

        var dropState = this.getDropState(ItemTypes.ITEM),
            backgroundColor;

        if (dropState.isHovering) {
            backgroundColor = '#CAD2C5';
        } else if (dropState.isDragging) {
            backgroundColor = '#52796F';
        }
        style.backgroundColor = backgroundColor;

        return (
            React.createElement("div", React.__spread({},  this.dropTargetFor(ItemTypes.ITEM), 
                {style: style, 
                className: "dropzone"}), 
            dropState.isHovering ? 'Release to drop' : 'Drag item here'
            )
        )
    }
});

module.exports = Dustbin;


},{"./ItemTypes.js":5}],4:[function(require,module,exports){
var ItemTypes = require('./ItemTypes.js');

var Block = React.createClass({displayName: "Block",
    mixins: [ReactDND.DragDropMixin],
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.ITEM, {
                dragSource: {
                    beginDrag: function(component) {
                        return {
                            item: {
                                name: component.props.name
                            }
                        };
                    }
                }
            });
        }
    },
    propTypes: {
        name: React.PropTypes.string.isRequired
    },
    render: function() {
        var style = {};

        var isDragging = this.getDragState(ItemTypes.ITEM).isDragging;
        style.opacity = isDragging ? 0.4 : 1;

        return (
            React.createElement("div", React.__spread({},  this.dragSourceFor(ItemTypes.ITEM), 
                {style: style, className: "block"}), 
            this.props.name
            )
        )
    }
});

module.exports = Block;


},{"./ItemTypes.js":5}],5:[function(require,module,exports){
var ItemTypes = {
    ITEM: 'item'
};

module.exports = ItemTypes;


},{}],6:[function(require,module,exports){
var Block = require('./Item');

var Toolbox = React.createClass({displayName: "Toolbox",
    render: function() {
        return (
            React.createElement("div", {className: "toolbox"}, 
                React.createElement("h5", null, "ToolBox"), 
                React.createElement(Block, {name: "Block #212"})
            )
        )
    }
});

module.exports = Toolbox;


},{"./Item":4}]},{},[1]);
