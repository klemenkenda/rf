'use strict'
// following the guide at
// http://machinelearningmastery.com/implement-random-forest-scratch-python/

let qm = require('qminer');
let csv = require('csv');
let fs = require('fs');
let rf = require('./rfdecisiontree.js');

function createBase() {
    let fields = [];
    // dynamically create fields
    for (let i = 0; i < 60; i++) {
        fields.push({ "name": "A" + i, "type": "float"}); 
    }
    fields.push({ "name": "Value", "type": "float"});

    // create based
    var baseConfig = {
        mode: 'createClean',
        schema: [
            {
                "name": "Sonar",
                "fields": []
            }
        ]
    };

    baseConfig["schema"][0]["fields"] = fields;

    return new qm.Base(baseConfig);
}

var base = createBase();

// f = fs.openSync('data/sonar.all-data.csv', 'r');
let buffer = fs.readFileSync('data/sonar.all-data.csv');
let data = buffer;

var X = [];
var y = [];

csv.parse(data, function(err, csvdata) {
    if (err) console.log(err);
    data = transformCSV(csvdata);
    // console.log(data);

    var rfTree = new rf.RFDecisionTree();

    console.log(X);
    console.log(y);

    rfTree.fit(X, y)
});


function transformCSV(csvdata) {
    var data = [];
    for (var i in csvdata) {
        var row = {}; 
        var rowV = [];       
        for (var j in csvdata[i]) {
            var c = csvdata[i][j];
            var x = parseFloat(csvdata[i][j]);
            if (isNaN(c)) {
                // we set 1 for mines and 0 for rocks
                if (c == "M") x = 1.0;
                if (c == "R") x = -1.0;
            }
            if (j < 60) {
                row["A" + j] = x;
                rowV.push(x);
            } else {
                row["Value"] = x;
                y.push(x);
            }
        }
        base.store("Sonar").push(row);
        data.push(row);
        X.push(rowV);
    }

    return data;
}

class RF {
    constructor() {

    }
}

// base.store("Sonar").push()
// var rforest = new rf.RF();
// console.log(rf);
