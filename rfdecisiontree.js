exports.RFDecisionTree = function() {
    


    this.fit = function(X, y) {

    }

    // fit(X, y)
    // predict(X)
    // getParams()
    // setParmas(param)
    // getModel()
    // save(fout)

    this.gini_index = function(groups, class_values) {
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
	this.unique = function(y) {
		var arr = [];
		for(var i = 0; i < y.length; i++) {
			if(arr.indexOf(y[i]) == -1) {				
				arr.push(y[i]);
			}
		}
		return arr; 
	}

	this.test_split = function(index, value, dataset) {
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

    this.get_split = function(X, y) {
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


