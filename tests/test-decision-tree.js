var rf = require('../rfdecisiontree.js');
var assert = require('assert');


describe("RFDecisionTree", function() {
    this.timeout(10000);
    it(".unique should return unique elements", function(done) {
        var rfTree = new rf.RFDecisionTree();
        assert.deepEqual(rfTree.unique([1, 2, 1, 2, 3, 2, 3, 4, 3, 2, 1]), [1, 2, 3, 4]);
        assert.deepEqual(rfTree.unique([10, 2, 2]), [10, 2]);        
        done();
    });

    it("Checking Gini index", function(done) {
        var groups = [
            [
                { "value": 1, "data": [1, 1, 1] },
                { "value": -1, "data": [2, 1, 2] },
                { "value": -1, "data": [1, 1, 2] }
            ],
            [
                { "value": -1, "data": [2, 1, 1] },
                { "value": -1, "data": [2, 1, 2] },
                { "value": -1, "data": [1, 1, 2] }
            ]
        ];
        var classes = [-1, 1];

        var rfTree = new rf.RFDecisionTree();
        assert.equal(rfTree.gini_index(groups, classes), 0.4444444444444445);
        done();
    });

    it("Checking to_terminal returning correct class", function(done) {
        var group = [
            { "value": 1, "data": [1, 1, 1] },
            { "value": -1, "data": [2, 1, 2] },
            { "value": -1, "data": [1, 1, 2] }
        ];
        var rfTree = new rf.RFDecisionTree();
        assert.equal(rfTree.to_terminal(group), -1);
        done();
    });

    it ("Testing test_split", function(done) {
        // TODO
        done();
    });

    it ("Testing get_split", function(done) {
        // TODO
        done();
    })
});