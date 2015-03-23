var App = require('./components/Application'),
    AppComponent = React.createFactory(App),
    surveyData = require('./data.js');

React.render(AppComponent(), document.getElementById('app'));

