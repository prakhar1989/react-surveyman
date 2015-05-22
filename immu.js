var { Map, List }= require('immutable');

var data = Map({count: 0, items: List()});

var newData = data.update('count', v => v + 1);

var moreData = data.update('items', list => list.push(data.get('count')))
console.log(moreData);
