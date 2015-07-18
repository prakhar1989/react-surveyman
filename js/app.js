var React = require("react");
var Immutable = require("immutable");
require('../css/main.css');
require("babel/polyfill");

var App = require("./components/Application"),
    AppComponent = React.createFactory(App);

React.render(AppComponent(), document.getElementById("app"));
