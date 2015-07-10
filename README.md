React-Surveyman
===

React-surveyman is a survey building tool for the [Surveyman](http://surveyman.github.io/) project. The idea is to build a drag-and-drop web interface where users generate instances of the types in the SurveyMan language, and combine them to form surveys. The system will use visual cues, like shape and color, to indicate types and legal operations. Once completed, the surveys will be exported to json which can then be fed into the Java program to build a live survey.

React-surveyman is an accepted project in [GSOC 2015](https://www.google-melange.com/gsoc/homepage/google/gsoc2015) under the [Plasma@UMass](http://plasma.cs.umass.edu/) group.

Currently, it uses
* [React 0.13.x](http://facebook.github.io/react/) with [JSX](https://facebook.github.io/jsx/);
* [Reflux](https://github.com/spoike/refluxjs), a simple library built on Facebook's [Flux](http://facebook.github.io/react/blog/2014/05/06/flux.html) ideas.
* [Immutable.js](http://facebook.github.io/immutable-js/) for immutability in the stores;
* [Babel](https://babeljs.io/) for ES6/ES7 transpilation and linting;
* [Webpack](http://webpack.github.io/) for the tooling.

![wireframe](http://i.imgur.com/LlAR6HW.png)

### Build and Run
In order to start the project locally - 
```
$ npm install 
$ npm run start 
# open localhost:8090 in your browser
```

### Tests
The test suite has it stands is pretty sparse right now and is primarily built for purpose of testing the flux stores.
```
$ npm run test
```
