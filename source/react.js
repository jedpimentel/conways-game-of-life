/**
*
* 
*/

var LifeCell = React.createClass({
	render: function() {
		var lifeStatus = (this.props.alive === true) ? 'cell-alive' : 'cell-dead';
		return (
			<div className={'life-cell ' + lifeStatus} />
		)
	}
	
});

var LifeField = React.createClass({
	// for ease of rendering, the cell matrix is arr[column][row] (vertical, then horizontal)
	getInitialState: function() {
		var matrixHeight = 50;
		var matrixWidth = 50;
		
		
		return ({
			matrixWidth: matrixWidth,
			matrixHeight: matrixHeight,
			cellMatrix: this.blankCellMatrix(matrixHeight, matrixWidth),
			generations: 0,
			stepTime: 100,
			
		});
	},
	ConwayCell: function() {
		this.alive = false;
		this.neighbors = 0;
	},
	blankCellMatrix: function(matrixHeight, matrixWidth, maintainOldVals) {
		var newCellMatrix = [];
		for (var i = 0; i < matrixHeight; i++) {
			newCellMatrix[i] = [];
			for (var j = 0; j < matrixWidth; j++) {
				newCellMatrix[i][j] = new this.ConwayCell();
			}
		}
		if (maintainOldVals === true) {
			var currentCellMatrix = this.state.cellMatrix;
			for (var i = 0; i < Math.min(matrixHeight, currentCellMatrix.length); i++) {
				
				for (var j = 0; j < Math.min(matrixWidth, currentCellMatrix[0].length); j++) {
					
					newCellMatrix[i][j] = currentCellMatrix[i][j];
				}
				
			}
		}
		return newCellMatrix;
	},
	setNewDimensions: function(x, y, isRelative) {
		return function() {
			//console.log(x, 'and', y);
			var newWidth = isRelative ? Math.max(this.state.matrixWidth + x, 10) : x;
			var newHeight = isRelative ? Math.max(this.state.matrixHeight + y, 10) : y;
			this.setState({
				matrixWidth: newWidth, 
				matrixHeight: newHeight,
				cellMatrix: this.blankCellMatrix(newWidth, newHeight, true),
			});
		}.bind(this);
	},
	randomize: function() {
		//console.log('randomizing...');
		var newMatrixSate = this.state.cellMatrix.map(function(row, rowIndx) {
			return row.map(function(cell, cellIndx) {
				var newCell = cell;
				if (Math.random() < 0.2) {
					newCell.alive = !cell.alive;
				} else {
					//newCell.alive = false;
				}
				return newCell;
			});
		});
		this.setState({cellMatrix: newMatrixSate})
	},
	// resetneighbors not used anymore, delete?
	resetNeighbors: function() {
		var newMatrixState = this.state.cellMatrix.map(function(row, rowIndex) {
			return row.map(function(cell, cellIndx) {
				var newCell = cell;
				newCell.neighbors = 0;
				return newCell;
			});
		});
		this.setState({cellMatrix: newMatrixState})
	},
	// returns shallow copy of matrix , with updated neighbor values
	// does not have setState since the matrix will still have manipulations left
	// the matrix this nreturns is in an intermediate state
	calcNeighbors: function() {
		//console.log('calculating neighbors...');
		
		var newMatrix = this.state.cellMatrix.map(function(row, rowIndex) {
			return row.map(function(cell, cellIndx) {
				var newCell = cell;
				newCell.neighbors = 0
				return newCell;
			});
		});
		
		var matrixHeight = this.state.matrixHeight;
		var matrixWidth = this.state.matrixWidth;
		
		// original version replaced wth map
		/*
		for (var i = 0; i < newMatrix.length; i++) {
			for (var j = 0; j < newMatrix[i].length; j++) {
				if (newMatrix[i][j].alive === true) {
					newMatrix[i][(j+1) % matrixWidth].neighbors++
					newMatrix[i][(matrixWidth+(j-1))%matrixWidth].neighbors++
					newMatrix[(i+1) % matrixHeight][(matrixWidth+(j-1))%matrixWidth].neighbors++
					newMatrix[(i+1) % matrixHeight][j].neighbors++
					newMatrix[(i+1) % matrixHeight][(j+1) % matrixWidth].neighbors++
					newMatrix[(matrixHeight+(i-1))%matrixHeight][(matrixWidth+(j-1))%matrixWidth].neighbors++
					newMatrix[(matrixHeight+(i-1))%matrixHeight][j].neighbors++
					newMatrix[(matrixHeight+(i-1))%matrixHeight][(j+1) % matrixWidth].neighbors++
				}
			}
		}
		*/
		
		
		this.state.cellMatrix.map(function(row, i) {
			row.map(function(cell, j) {
				if (newMatrix[i][j].alive === true) {
					newMatrix[i][(j+1) % matrixWidth].neighbors++
					newMatrix[i][(matrixWidth+(j-1))%matrixWidth].neighbors++
					newMatrix[(i+1) % matrixHeight][(matrixWidth+(j-1))%matrixWidth].neighbors++
					newMatrix[(i+1) % matrixHeight][j].neighbors++
					newMatrix[(i+1) % matrixHeight][(j+1) % matrixWidth].neighbors++
					newMatrix[(matrixHeight+(i-1))%matrixHeight][(matrixWidth+(j-1))%matrixWidth].neighbors++
					newMatrix[(matrixHeight+(i-1))%matrixHeight][j].neighbors++
					newMatrix[(matrixHeight+(i-1))%matrixHeight][(j+1) % matrixWidth].neighbors++
				}
			}); 
		});
		
		
		
		//console.log('done calcing neighbors');
		//this.setState({cellMatrix: newMatrixState});
		
		return newMatrix;
	},
	// finishes updating the matrix, is fed matrix with updated neighbor data in order to check which cells are alive
	calcIfAlive: function(matrixWithUpdatedNeighbors) {
		
		var a = (new Date()).getTime();
		//console.log('old matrix state', this.state.cellMatrix)
		var newMatrixState = matrixWithUpdatedNeighbors.map(function(row, rowIndex) {
			return row.map(function(cell, columnIndex) {
				var newCell = cell;
				if (newCell.alive === true) {
					if ((newCell.neighbors < 2) || (newCell.neighbors > 3)) {
						newCell.alive = false;
					} else {
						newCell.alive = true;
					}
				} else {
					if (newCell.neighbors === 3) {
						newCell.alive = true;
					} else {
						newCell.alive = false;
					}
				}
				return newCell;
			});
		});
		//console.log('calc if alive state', newMatrixState);
		var b = (new Date()).getTime();
		//console.log('set in', b - a)
		this.setState({
			cellMatrix: newMatrixState,
			generations: this.state.generations + 1,
		});
	},
	step: function() { 
		//var startTime = (new Date()).getTime();
		//console.log('step');
		var matrixWithUpdatedNeighbors = this.calcNeighbors();
		//var midTime = (new Date()).getTime();
		//console.log('neighbors', this.state.cellMatrix);
		this.calcIfAlive(matrixWithUpdatedNeighbors);
		//console.log('alive', this.state.cellMatrix);
		//var endTime = (new Date()).getTime();
		//console.log(endTime - startTime, 'ms (',midTime - startTime,'+', endTime - midTime);
	},
	startAutoStep: function() {
		//console.log("setting interval at", this.state.stepTime, "ms")
		this.autoStep = setInterval( this.step, this.state.stepTime);
	},
	stopAutoStep: function() {
		// this sould also be called in componentWillUnmount in case component is meant to be unmounted
		//console.log('before', this.autoStep)
		clearInterval(this.autoStep);
		delete this.autoStep;
		this.setState({});
	}, 
	cellClick: function(row, column) {
		return function() {
			var newMatrixState = this.state.cellMatrix.map(function(row) {
				return row.slice();
			});
			newMatrixState[row][column].alive = !newMatrixState[row][column].alive;
			this.setState({cellMatrix: newMatrixState});
		}.bind(this);
	},
	render: function() {
		//var renderStart = (new Date()).getTime();
		
		// render method taxes approx 90ms on my pc
		
		var columns = this.state.matrixWidth;
		var rows = this.state.matrixHeight;
		var cellClick = this.cellClick;
		//console.log(this.state.cellMatrix);
		//console.log('cellmatrix', this.state.cellMatrix);
		var lifeCells = this.state.cellMatrix.map(function(cellRow, rowIndex) {
			//console.log('cellrow', cellRow);
			var rowHTML = cellRow.map(function(cell, columnIndex) {
				//var cellValue = (cell.alive ? '☺' : '○');
				var cellLIfeStatus = (cell.alive ? 'cell-alive' : 'cell-dead');
				return (
					<div 
						key={+rowIndex+'&'+columnIndex} 
						onMouseDown={cellClick(rowIndex, columnIndex)} 
						className={'life-cell '+cellLIfeStatus}
					>{' '}</div>
				);
			});
			return <div key={'row('+rowIndex+')'} className='life-cell-row'>{rowHTML}</div>
		});
		
		//var renderEnd = (new Date()).getTime();
		//console.log('rendered in', renderEnd - renderStart)
		
		var startButton;
		if (this.autoStep === undefined) {
			startButton = <button onClick={this.startAutoStep} >start</button>
		} else {
			//console.log('autostep', this.autoStep)
			startButton = <button onClick={this.stopAutoStep} >pause</button>
			
		}
		
		console.log('frame time:', ((new Date).getTime() - this.lastStepTime) || 0 );
		this.lastStepTime = (new Date).getTime()
		
		return (
			<div>
				<style>
					{'.life-cell{ width: ' + (100 / columns) + '%;}'} 
					{'.life-cell-row { height: ' + (100 / rows) + '%;}'} 
				</style> 
				<div>{columns + ' by ' + rows + ' matrix. Generations: ' + this.state.generations}</div>
				<div id='cell-field'>
					{lifeCells}
				</div><br/>
				<div className='button-group'>
					<button onClick={this.randomize}>random</button> 
					{startButton}
					<button onClick={this.setNewDimensions(-10,-10, true)} >smaller</button>
					<button onClick={this.setNewDimensions(+10,+10, true)} >bigger</button>
				</div>
			</div>
		)
	}
	
});

var ConwayApp = React.createClass({
	render: function() {
		return (
			<LifeField />
		);
	}
});

ReactDOM.render(
	<ConwayApp />,
	document.getElementById('main')
)