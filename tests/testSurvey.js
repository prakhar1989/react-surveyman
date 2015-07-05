var Immutable = require('immutable');
var assert = require('assert');
var data = require('./data/survey.js')

var survey = Immutable.fromJS(data);

// setup the block map
var _blockMap = Immutable.fromJS({
  "b_41444": "b_90914",
  "b_53209": "b_10101",
  "b_39562": "b_53209"
});

function getBlockIndex(blockId, parentBlock = survey, path = []) {
    var isSubblock = _blockMap.has(blockId);
    if (!isSubblock) {
        let index = parentBlock.findIndex(b => b.get('id') === blockId);
        return path.concat(index);
    }
}

// test cases
describe('Immutable', function() {
  describe("get()", function() {
    it("should return the block index of top block correctly", function() {
      assert.equal(survey.getIn([0, 'id']), "b_10101");
    });
  });
});
