// following the guide at
// http://machinelearningmastery.com/implement-random-forest-scratch-python/

let qm = require('qminer');
let csv = require('csv');
let fs = require('fs');

class RFDecisionTree {
    constructor() {

    }

    fit(X, y) {

    }

    // fit(X, y)
    // predict(X)
    // getParams()
    // setParmas(param)
    // getModel()
    // save(fout)

    gini_index(groups, class_values) {
        let gini = 0.0;
        for (class_value in class_values) {
            for (group in groups) {
                let size = group.length;
                if (size != 0) {
                    let sum = 0;
                    for (row in group) {
                        if (row["value"] == class_value) sum++;
                    };
                    let proportion = sum / size;
                    gini += (proportion * (1.0 - proportion));
                }
            }
        }

        return gini;
    }

	// finds a set of unique values of y
	unique(y) {
		var arr = [];
		for(var i = 0; i < y.length; i++) {
			if(!arr.contains(y[i])) {
				arr.push(y[i]);
			}
		}
		return arr; 
	}

	test_split(index, value, dataset) {
		let left = [];
		let right = [];

		for (rowi in dataset) {
			row = dataset[rowi];
			if (row[index] < value) {
				left.push(row);
			} else {
				right.push(row);
			}
		}

		return [ left, right ];
	}

    get_split(X, y) {
		// all possible classes in y
		let class_values = unique(y);
		let b_index = 999;
		let b_value = 999;
		let b_score = 999;
		let b_groups = null;

		let features = {};
		let n_features = X[0].length;
		let n_items = X.length;

		while (features.length < n_features) {
			let index = Math.floor((Math.random() * n_items) + 1);
			if (!(index in features)) {
				features.push(index);
			}			
		}

		for (i in features) {
			let index = features[i];
			for (rowi in dataset) {
				row = dataset[rowi];
				groups = test_split(index, row[index], dataset);				
				gini = gini_index(groups, class_values);
				if (gini < b_score) {
					b_index = index;
					b_value = row[index];
					b_score = gini;
					b_groups = groups;
				}
			}
		}
		return { 'index': b_index, 'value': b_value, 'groups': b_groups };
    }


}

class RF {
    constructor() {

    }
}


function createBase() {
    let fields = [];
    // dynamically create fields
    for (i = 0; i < 60; i++) {
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

csv.parse(data, function(err, csvdata) {
    if (err) console.log(err);
    data = transformCSV(csvdata);
    // console.log(data);
});

function transformCSV(csvdata) {
    let data = [];
    for (i in csvdata) {
        let row = {};        
        for (j in csvdata[i]) {
            c = csvdata[i][j];
            x = parseFloat(csvdata[i][j]);
            if (isNaN(c)) {
                // we set 1 for mines and 0 for rocks
                if (c == "M") x = 1.0;
                if (c == "R") x = -1.0;
            }
            if (j < 60) row["A" + j] = x;
            else row["Value"] = x;
        }
        base.store("Sonar").push(row);
        data.push(row);
    }

    return data;
}

// base.store("Sonar").push()

