(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var App = require('./components/Application');
var AppComponent = React.createFactory(App);

React.render(AppComponent(), document.getElementById('app'));



},{"./components/Application":2}],2:[function(require,module,exports){
var Dustbin = require('./Dustbin'),
    Item = require('./Item');

var Container = React.createClass({displayName: "Container",
    render: function() {
        return (
            React.createElement("div", null, 
                React.createElement(Dustbin, null), 
                React.createElement("div", null, 
                    React.createElement(Item, {name: "Glass"}), 
                    React.createElement(Item, {name: "Paper"}), 
                    React.createElement(Item, {name: "Banana"})
                )
            )
        )
    }
});

module.exports = Container;


},{"./Dustbin":3,"./Item":4}],3:[function(require,module,exports){
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
        var style = {
            height: '12rem',
            width: '12rem',
            color: 'white',
            padding: '2rem',
            textAlign: 'center'
        };

        var dropState = this.getDropState(ItemTypes.ITEM),
            backgroundColor = '#222';

        if (dropState.isHovering) {
            backgroundColor = 'darkgreen';
        } else if (dropState.isDragging) {
            backgroundColor = 'darkkhaki';
        }
        style.backgroundColor = backgroundColor;

        return (
            React.createElement("div", React.__spread({},  this.dropTargetFor(ItemTypes.ITEM), 
                {style: style}), 
            dropState.isHovering ? 'Release to drop' : 'Drag item here'
            )
        )
    }
});

module.exports = Dustbin;


},{"./ItemTypes.js":5}],4:[function(require,module,exports){
var ItemTypes = require('./ItemTypes.js');

var Item = React.createClass({displayName: "Item",
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
        var style = {
            border: '1px dashed gray',
            backgroundColor: 'white',
            padding: '0.5rem',
            margin: '0.5rem',
            maxWidth: 80
        };

        //var isDragging = this.getDragState(ItemTypes.ITEM).isDragging;
        var isDragging = this.getDragState(ItemTypes.ITEM).isDragging;
        style.opacity = isDragging ? 0.4 : 1;

        return (
            React.createElement("div", React.__spread({},  this.dragSourceFor(ItemTypes.ITEM), 
                {style: style}), 
            this.props.name
            )
        )
    }
});

module.exports = Item;


},{"./ItemTypes.js":5}],5:[function(require,module,exports){
var ItemTypes = {
    ITEM: 'item'
};

module.exports = ItemTypes;


},{}]},{},[1]);
