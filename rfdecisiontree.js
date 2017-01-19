exports.RFDecisionTree = function() {
    
	// instead of a constructor
	// max_depth, min_size, sample_size, n_trees, n_features


    this.fit = function(X, y) {
		// TODO
		// build dataset from X, y
		
		var root = get_split(dataset, this.n_features);
		split(root, this.max_depth, this.min_size, this.n_features, 1);
    }

	this.setParams = function(max_depth, min_size, sample_size, n_trees, n_features) {
		this.max_depth = max_depth;
		this.min_size = min_size;
		this.sample_size = sample_size;
		this.n_trees = n_trees;
		this.n_features = n_features;
	}

	this.getParams = function() {
		return {
			max_depth: this.max_depth,
			min_size: this.min_size,
			sample_size: this.sample_size,
			n_trees: this.n_trees,
			n_features: this.n_features
		}
	}

    // predict(X)
    // getModel()
    // save(fout)

	// TODO: spliting criteria for regression is
	// RSS - \sum_left (y_i - y_L*)^2 + \sum_right (y_i - y_R*)^2
	// y_L* is mean value of left node

    this.gini_index = function(groups, class_values) {
        var gini = 0.0;
        for (class_valuei in class_values) {
			class_value = class_values[class_valuei];
            for (groupi in groups) {
                var group = groups[groupi]
				var size = group.length;
                if (size != 0) {
                    var sum = 0;
                    for (rowi in group) {
                        row = group[rowi];
						if (row["value"] == class_value) sum++;
                    };
                    var proportion = sum / size;
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

    this.get_split = function(dataset, n_features) {
		// all possible classes in y
		var class_values = unique(y);
		var b_index = 999;
		var b_value = 999;
		var b_score = 999;
		var b_groups = null;

		var features = {};		
		var n_items = X.length;

		while (features.length < n_features) {
			var index = Math.floor((Math.random() * n_items) + 1);
			// TODO: check (!)
			if (!(index in features)) {
				features.push(index);
			}			
		}

		for (i in features) {
			var index = features[i];
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

	this.to_terminal = function(group) {
		var outcomes = {};
		for (rowi in group) {
			row = group[rowi];
			var key = row["value"];
			if (key in outcomes) outcomes[key]++;			
			else outcomes[key] = 1;
		}

		// find key with max value
		var maxVal = -1;
		var maxKey = "";
		Object.keys(outcomes).map(function(key) {
			if (outcomes[key] > maxVal) {
				maxKey = key;
			}
		});

		return maxKey;
	}

	this.split = function(node, max_depth, min_size, n_features, depth) {
		
	}

}


