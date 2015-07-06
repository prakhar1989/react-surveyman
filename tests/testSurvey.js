var Immutable = require('immutable');
var assert = require('assert');
var data = require('./data/survey.js')

function getBlockPath(blockID, survey, _blockMap) {
    // function that returns a chain of IDs from the root block
    // to the block with id - id
    var getIDsList = function getIDsList(id, path = []) {
        if (!_blockMap.has(id)) {
            return path.concat([id]).reverse()
        }
        return getIDsList(_blockMap.get(id), path.concat([id]));
    };

    // function that returns the index of block id within the list of blocks
    var getIndex = (id, list) => list.findIndex(b => b.get('id') === id);

    // initialize path with index of root node
    var [rootID, ...restIDs] = getIDsList(blockID);
    var path = [getIndex(rootID, survey)];

    // reduce over the rest of ids by finding id at each level
    // and changing path accordingly
    return restIDs.reduce((path, id) => {
        var path = path.concat(['subblocks']);
        var index = getIndex(id, survey.getIn(path));
        return path.concat([index]);
    }, path);
}

describe("getBlockPath", function() {
  beforeEach(function() {
      this.survey = Immutable.fromJS(data);
      this._blockMap = Immutable.fromJS({
        "b_41444": "b_90914",
        "b_53209": "b_10101",
        "b_39562": "b_53209",
        "b_99223": "b_53209"
      });
  });

  it("should return the index paths correctly", function() {
      assert.deepEqual(getBlockPath('b_10101', this.survey, this._blockMap), [0]);
      assert.deepEqual(getBlockPath('b_90914', this.survey, this._blockMap), [1]);
      assert.deepEqual(getBlockPath('b_41444', this.survey, this._blockMap), [1, 'subblocks', 0]);
      assert.deepEqual(getBlockPath('b_53209', this.survey, this._blockMap), [0, 'subblocks', 0]);
      assert.deepEqual(getBlockPath('b_39562', this.survey, this._blockMap), [0, 'subblocks', 0, 'subblocks', 0]);
      assert.deepEqual(getBlockPath('b_99223', this.survey, this._blockMap), [0, 'subblocks', 0, 'subblocks', 1]);
  });
  it("should get the correct block", function() {
      var block = this.survey.getIn(getBlockPath('b_39562', this.survey, this._blockMap));
      assert(!block.get('randomize'));
  });
  it("should delete the block correctly", function() {
      var newSurvey = this.survey.deleteIn(getBlockPath('b_10101', this.survey, this._blockMap));
      assert(this.survey.count(), newSurvey.count() + 1);
  })
});
