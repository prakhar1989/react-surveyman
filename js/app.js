var App = require('./components/Application'),
    AppComponent = React.createFactory(App)

React.render(AppComponent(), document.getElementById('app'));

