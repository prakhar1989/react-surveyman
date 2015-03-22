var App = require('./components/Application');
var AppComponent = React.createFactory(App);

React.render(AppComponent(), document.getElementById('app'));

