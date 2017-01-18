var rf = require('./rfdecisiontree.js');
var assert = require('assert');


describe("RFDecisionTree", function() {
    this.timeout(10000);
    it(".unique should return unique elements", function(done) {
        var rfTree = new rf.RFDecisionTree();
        assert.deepEqual(rfTree.unique([1, 2, 1, 2, 3, 2, 3, 4, 3, 2, 1]), [1, 2, 3, 4]);
        assert.deepEqual(rfTree.unique([1, 2, 2]), [1, 2]);        
        done();
    });
});