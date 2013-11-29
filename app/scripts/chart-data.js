ChartData = function() {
	this.chart = {
		columnDefinition: [ { id: "date", label: "Date", type: "date" } ],
		data: {}
	};

	// cols = [ 
	// 	{ id: "date", label: "Date", type: "date" },
	// 	{ id: "impressions", label: "Impressions", type: "number" },
	// 	{ id: "interactions", label: "Interactions", type: "number" }
 	// 	];	
	
	// rows = [ 
	// 	{ c: [ { v: date }, { v: impression }, { v: interaction },
	// 	{ c: [ { v: date }, { v: impression }, { v: interaction }
	// ];
};

ChartData.prototype.transformToGoogleChartData = function() {
	var data = {
		cols: [],
		rows: []
	};

	for (var i = 0; i < this.chart.columnDefinition.length; i++) { data.cols.push(this.chart.columnDefinition[i]); }
	if (data.cols.length === 1) data.cols.push( { id: "dummy", label: "Business", type: "number" } );

	var dates = Object.keys(this.chart.data).sort(function(dateStr, anotherDateStr) { 
		var date = new Date(dateStr);
		var anotherDate = new Date(anotherDateStr);
		if (date < anotherDate) return -1;
		else if (date > anotherDate) return 1;
		return 0;
	});

	for (var rowIdx = 0; rowIdx < dates.length; rowIdx++) {
		var row = { c: [ { v: new Date(dates[rowIdx]) } ] };
		var columns = this.chart.data[dates[rowIdx]];
		for (var colIdx = 0; colIdx < columns.length; colIdx++) { row.c.push({ v : columns[colIdx] }); }
		data.rows.push(row);
	}

    return data;
};

ChartData.prototype.addColumn = function(id, label, type, rows) {
	this.chart.columnDefinition.push( { id: id, label: label, type: type } );
	this.chart.columnDefinition.push( { type: "boolean", role: "certainty" } );
	this.chart.columnDefinition.push( { type: "boolean", role: "emphasis"} );

	for (var i = 0; i < rows.length; i++) {
		var row = rows[i];
		var existingRow = this.chart.data[row.key];
		if (!existingRow) {
			existingRow = [];
			this.chart.data[row.key] = existingRow;
		}
		existingRow.push(row.value);
		existingRow.push(id.indexOf("average") === -1); // certainty - false = dashed
		existingRow.push(id.indexOf("interactions") !== -1); // emphasis - true = bold
	}
};