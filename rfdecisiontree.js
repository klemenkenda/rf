exports.RFDecisionTree = function(max_depth = 20, min_size = 1, n_features = -1) {
    
	// instead of a constructor
	// max_depth, min_size, sample_size, n_trees, n_features
	this.tree = [];

	// set default params
	this.max_depth = max_depth;
	this.min_size = min_size;
	this.n_features = n_features;

	this.fit = function(X, y) {
		// build dataset from X, y; we want to keep them together for easier splitting

		// check sizes
		if (X.length != y.length) {
			console.log("Length of attribute matrix not equal to length of target value vector");
			return;
		}

		// check number of features
		if (X[0].length < this.n_features) {
			console.log("Not enough features: " + X[0].length + " < " + this.n_features);
			return;
		}

		// is n_features -1 (means - use all features?)
		if (this.n_features == -1) {
			this.n_features = X[0].length;
		}

		var dataset = [];
		for (i in X) {
			var value = y[i];
			var attributes = X[i];
			dataset.push({ "value": value, "data": attributes });
		}
		
		console.log(dataset);
		// get first split
		this.tree = this.get_split(dataset, this.n_features);
		console.log(this.tree);
		this.split(this.tree, this.max_depth, this.min_size, this.n_features, 1);
		console.log(this.tree);
	}

	this.setParams = function(max_depth, min_size, n_features) {
		this.max_depth = max_depth;
		this.min_size = min_size;
		this.n_features = n_features;
	}

	this.getParams = function() {
		return {
			max_depth: this.max_depth,
			min_size: this.min_size,
			n_features: this.n_features
		}
	}

    // predict(X)
    // getModel()
    // save(fout)

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
			if (row["data"][index] < value) {
				left.push(row);
			} else {
				right.push(row);
			}
		}

		return [ left, right ];
	}

	this.get_split = function(dataset, n_features) {
		// put class values into a separate array
		var y = [];
		for (i in dataset) {
			y.push(dataset[i]["value"]);
		}

		// all possible classes in y
		var class_values = this.unique(y);
		var b_index = 999;
		var b_value = 999;
		var b_score = 999;
		var b_groups = null;

		var features = [];		
		var n_items = dataset.length;
		var n_allfeatures = dataset[0]["data"].length;

		while (features.length < n_features) {
			var index = Math.floor((Math.random() * n_allfeatures));
			if (features.indexOf(index) == -1) {
				features.push(index);				
			}			
		}

		for (i in features) {
			var index = features[i];			
			for (rowi in dataset) {
				row = dataset[rowi];
				groups = this.test_split(index, row["data"][index], dataset);				
				gini = this.gini_index(groups, class_values);				
				if (gini < b_score) {
					b_index = index;
					b_value = row["data"][index];
					b_score = gini;
					b_groups = groups;
				}
			}
		}
		return { 'index': b_index, 'value': b_value, 'score': b_score, 'groups': b_groups };
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
		var left = node["groups"][0];
		var right = node["groups"][1];
		delete node["groups"];
		
		// check for a no split
		if ((left.length == 0) || (right.length == 0)) {
			console.log("One null.");
			var both = left.concat(right);
			node['left'] = this.to_terminal(both);
			node['right'] = this.to_terminal(both);
			return;
		}

		// check for max depth
		if (depth >= max_depth) {
			node['left'] = this.to_terminal(left);
			node['right'] = this.to_terminal(right);
			return;
		}

		// process left child
		if (left.length <= min_size) {
			console.log("Left terminal.");
			node['left'] = this.to_terminal(left);			
		} else {
			console.log("Left - non-terminal.");
			node['left'] = this.get_split(left, n_features);
			this.split(node['left'], max_depth, min_size, n_features, depth + 1);
		}

		// process right child
		if (right.length <= min_size) {
			console.log("Right - terminal.");
			node['right'] = this.to_terminal(right);
		} else {
			console.log("Right - non-terminal.");
			node['right'] = this.get_split(right, n_features);
			this.split(node['right'], max_depth, min_size, n_features, depth + 1);
		}		
	}

	this.predictRow = function(x) {
		return this.predictNode(this.tree, x);
	}

	this.predictNode = function(node, x) {
		if (x[node['index']] < node['value']) {
			if (typeof(node['left']) === 'object') {
				return this.predictNode(node['left'], x);
			} else {
				return node['left'];
			}
		} else {
			if (typeof(node['right']) === 'object') {
				return this.predictNode(node['right'], x);
			} else {
				return node['right'];
			}
		}
	}
}

