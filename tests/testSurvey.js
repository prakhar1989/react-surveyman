var Immutable = require('immutable');
var assert = require('assert');
var data = require('./data/survey.js')

var survey = Immutable.fromJS(data);

// setup the block map
var _blockMap = Immutable.fromJS({
  "b_41444": "b_90914",
  "b_53209": "b_10101",
  "b_39562": "b_53209",
  "b_99223": "b_53209"
});

function getPath(blockID) {
    var getIDsList = (id, path = []) => {
      if (!_blockMap.has(id)) {
        return path.concat([id]).reverse()
      }
      return getIDsList(_blockMap.get(id), path.concat([id]));
    };

    var [rootID, ...restIDs] = getIDsList(blockID);
    var path = [survey.findIndex(b => b.get('id') === rootID)];

    return restIDs.reduce((path, id) => {
      let index = survey.getIn(path.concat(['subblocks']))
                      .findIndex(b => b.get('id') === id);
      return path.concat(['subblocks', index]);
    }, path);
}

describe("getPath", function() {
  it("should return the index paths correctly", function() {
    assert.deepEqual(getPath('b_10101'), [0]);
    assert.deepEqual(getPath('b_90914'), [1]);
    assert.deepEqual(getPath('b_41444'), [1, 'subblocks', 0]);
    assert.deepEqual(getPath('b_53209'), [0, 'subblocks', 0]);
    assert.deepEqual(getPath('b_39562'), [0, 'subblocks', 0, 'subblocks', 0]);
    assert.deepEqual(getPath('b_99223'), [0, 'subblocks', 0, 'subblocks', 1]);
  });
  it("should get the correct block", function() {
    var block = survey.getIn(getPath('b_39562'))
    assert(!block.get('randomize'));
  });
});
