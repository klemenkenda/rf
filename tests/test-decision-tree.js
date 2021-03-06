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
        var dataset = [
            { "value": 1, "data": [1, 1, 1] },
            { "value": -1, "data": [2, 1, 2] },
            { "value": -1, "data": [1, 1, 2] }
        ];

        var datasetSplit = [
            [
                { "value": 1, "data": [1, 1, 1] },
                { "value": -1, "data": [1, 1, 2] }
            ],
            [
                { "value": -1, "data": [2, 1, 2] }            
            ]
        ];
        var rfTree = new rf.RFDecisionTree();
        assert.deepEqual(rfTree.test_split(0, 1.5, dataset), datasetSplit);
        done();
    });

    it ("Testing get_split", function(done) {
        var dataset = [
            { "value": 1, "data": [1, 1, 1] },
            { "value": -1, "data": [2, 1, 2] },
            { "value": -1, "data": [1, 1, 2] }
        ];

        var datasetSplit = {
            index: 2,
            value: 2, 
            score: 0,
            groups: [
                [
                    { "value": 1, "data": [1, 1, 1] },
                ],
                [
                    { "value": -1, "data": [2, 1, 2] },
                    { "value": -1, "data": [1, 1, 2] }                    
                ]
            ]
        }
        var rfTree = new rf.RFDecisionTree();
        assert.deepEqual(rfTree.get_split(dataset, 3), datasetSplit);
        done();
    });

    it ("Testing to_terminal", function(done) {
        var d1 = [
            { "value": 1, "data": [1, 1, 1] },
        ];

        var d2 = [
            { "value": -1, "data": [2, 1, 2] },
            { "value": -1, "data": [1, 1, 2] }                    
        ];

        var d3 = [
            { "value": 1, "data": [1, 1, 1] },
            { "value": -1, "data": [2, 1, 2] },
            { "value": -1, "data": [1, 1, 2] }
        ];

        var rfTree = new rf.RFDecisionTree();
        assert.equal(rfTree.to_terminal(d1), 1);
        assert.equal(rfTree.to_terminal(d2), -1);
        assert.equal(rfTree.to_terminal(d3), -1);
        done();
    });

    it ("Check split()", function(done) {
        var datasetSplit = {
            index: 2,
            value: 2, 
            score: 0.44444444444445, 
            groups: [
                [
                    { "value": 1, "data": [1, 1, 1] },
                ],
                [
                    { "value": -1, "data": [2, 1, 2] },
                    { "value": -1, "data": [1, 1, 2] },
                    { "value": 1, "data": [1, 1, 3] },
                ]
            ]
        }

        var rfTree = new rf.RFDecisionTree();
        rfTree.split(datasetSplit, 3, 1, 3, 1);   
        console.log("Decision tree: ", datasetSplit);     
        done();
    });

    it ("Check predictRow(x)", function(done) {
        var X = [
            [1, 1, 3],
            [2, 1, 2],
            [1, 1, 2]
        ];

        var y = [
            1,
            -1,
            -1
        ];

        rfTree = new rf.RFDecisionTree();
        // rfTree.setParams(5, 1, 1, 3);
        rfTree.fit(X, y);
        assert.equal(rfTree.predictRow([1, 1, 3]), 1);
        assert.equal(rfTree.predictRow([1, 1, 2]), -1);
        done();
    });


});