React-Surveyman
===

React-surveyman is a survey building tool for the [Surveyman](https://github.com/SurveyMan/SurveyMan) project. The key idea is to build a drag-and-drop web interface where users generate instances of the types in the SurveyMan language, and combine them to form surveys. The system will use visual cues, like shape and color, to indicate types and legal operations. Once completed, the surveys will be exported to json which can then be fed into the Java program to build a live survey.

React-surveyman is an accepted project in [GSOC 2015](https://www.google-melange.com/gsoc/homepage/google/gsoc2015) under the [Plasma@UMass](http://plasma.cs.umass.edu/) group.

### Wireframe

![wireframe](http://i.imgur.com/LlAR6HW.png)

### Build and Run
In order to run the project locally - 
```
$ npm install 
$ npm run build
$ python -m SimpleHTTPServer
```

### Development
To setup incremental compilation of `js` files, just run `npm run watch`.
