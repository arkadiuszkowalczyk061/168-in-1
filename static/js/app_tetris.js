document.addEventListener('DOMContentLoaded', () => {
	// create access  to main div
	const grid = document.querySelector('.grid');
	// create an array  of  200 div from html
	// let squares = Array.form(document.querySelectorAll('.grid.div'))
	let squares = [...document.querySelectorAll('.grid div')];
	// get selectors by ID
	const scoreDisplay = document.querySelector('#score');
	const startbtn = document.querySelector('#start-button');

	const width = 10;
	let nextRandom = 0;
	let timeId
	let score = 0;
	const colour = [
		'orange', 'red', 'green', 'blue', 'fuschia'
	]
	// The tetrominoes
	// we have five shape / first shape and four position on the field
	const lElement = [
		[1, width+1, width*2+1, 2],
		[width, width+1, width+2, width*2+2],
		[1, width+1, width*2+1, width*2],
		[width, width*2, width*2+1,width*2+2]
	  // z shape
	]
	const zElement = [
		[0, width, width+1, width*2+1],
		[width+1, width+2, width*2, width*2+1],
		[0, width, width+1, width*2+1],
		[width+1, width+2, width*2, width*2+1]
		// t shape
	]
	const tElement = [
		[1, width, width+1, width+2],
		[1, width+1, width+2, width*2+1],
		[width, width+1, width+2, width*2+1],
		[1, width, width+1, width*2+1]
	]
	// square shape
	const oElement = [
		[0, 1, width, width+1],
		[0, 1, width, width+1],
		[0, 1, width, width+1],
		[0, 1, width, width+1]
	]
	// i shape moreover it's position on board'
	const iElement = [
		[1, width+1, width*2+1, width*3+1],
		[width, width+1, width+2, width+3],
		[1, width+1, width*2+1, width*3+1],
		[width, width+1, width+2, width+3]

	]
	// gathering all elements in one array
	const theTetris = [lElement, zElement, tElement, oElement, iElement];

	let currentPosition = 4;
	let currenrRotation = 0
	//select randomly Tetromino futhermore rotation
	let random = Math.floor(Math.random()*theTetris.length)

	let current = theTetris[random][currenrRotation];


	// draw the first rotation in the first element

	// const draw = () => {}
	function draw() {
		current.forEach(index => {
			squares[currentPosition + index].classList.add('tetromino');
			squares[currentPosition + index].style.backgroundColor = colour[random];
		})
	}
	// screen cleaning / undraw
	function unDraw () {
		current.forEach(index => {
			squares[currentPosition + index].classList.remove('tetromino');
			squares[currentPosition + index].style.backgroundColor = '';

		})
	}
	// make element to move down evry second
	function moveDown (){
		unDraw();
		currentPosition += width;
		draw();
		freeze();
	}
	// timeId = setInterval(moveDown, 500);

	// assign move elements

	function controlElements (event) {
		switch(event.keyCode) {
			case 37:
				moveLeft();
				break;
			case 39:
				moveRight();
				break;
			case 38:
				rotateShape();
				break;
			case 40:
				moveDown();
				break;
		}
	}

	document.addEventListener('keyup', controlElements);
	// freeze element  on the field function
	function freeze() {
		// checks if current have class  'taken'

		if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
			current.forEach(index => squares[currentPosition + index].classList.add('taken'))
			random = nextRandom;
			nextRandom = Math.floor(Math.random() * theTetris.length);
			current = theTetris[random][currenrRotation];
			currentPosition = 4;   //random
			draw();
			displayShape();
			addScore();
			gameOver();

		}
	}
	function moveLeft () {
		unDraw()
		// this contitional checks is element exceeds/touching left edge
		const LeftEdge = current.some(index =>(currentPosition + index) % width === 0);
		if(!LeftEdge) {
			currentPosition--;
		}
		if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
			currentPosition++;
		}
		draw();
	}

	function moveRight () {
		unDraw()
		// this contitional checks is element exceeds/touching right  edge
		// i have to check different parameter 9 % 10 === 10 -1  / right side
		const rightedge = current.some(index =>(currentPosition + index) % width === width -1);
		if(!rightedge) {
			currentPosition++;
		}
		if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
			currentPosition--;
		}
		draw();
	}
	// rotate element
	const rotateShape = () => {
		unDraw();
		// increment
		currenrRotation++;
		// check conditional if is 4 reset to 0 because i have 4 position for element
		if(currenrRotation === current.length) {
			currenrRotation = 0;
		}
		current =theTetris[random][currenrRotation];
		draw();
	}
	// preview next element
	const miniGrid = {
		previewSquares: document.querySelectorAll('.mini-grid div'),
		displayWidth: 4,
		displayIndex: 0,
	}
	// create array element position
	const nextTetris = [
		[1, miniGrid.displayWidth+1, miniGrid.displayWidth*2+1, 2],   //lElement
		[0, miniGrid.displayWidth, miniGrid.displayWidth+1, miniGrid.displayWidth*2+1], //zElement
		[1, miniGrid.displayWidth, miniGrid.displayWidth+1, miniGrid.displayWidth+2], //tElement
		[0, 1, miniGrid.displayWidth, miniGrid.displayWidth+1], //oElement
		[1, miniGrid.displayWidth+1, miniGrid.displayWidth*2+1, miniGrid.displayWidth*3+1] //iElement
	]
	// shoh shape in mini window
	function displayShape() {
		// remove any element from mini grid /clear field
		miniGrid.previewSquares.forEach(square => {
			square.classList.remove('tetromino');
		})

		// draw  next element in mini grid / add appropiate class
		nextTetris[nextRandom].forEach(index => {
			miniGrid.previewSquares[miniGrid.displayIndex + index].classList.add('tetromino');
		})
	}
	// start /pause button
	startbtn.addEventListener('click', () => {
		if (timeId) {
			clearInterval(timeId);
			timeId = null;
		}
		else {
			resumeGame();
		}
	})

	// restart pause / it's problem draws another one element
	const resumeGame = () => {
		draw();
		timeId = setInterval(moveDown, 500);
		nextRandom = Math.floor(Math.random() * theTetris.length);
		displayShape();
	}


	const  addScore = () => {
		for (let i =0; i <199; i+=width) {  //two times i checked 10   
			if (i % 10 === 0) {
				// add another lood and create  array
				const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9] // how can i improve this statement??

				if (row.every(index => squares[index].classList.contains('taken'))) {
					score += 10;
					// pass score to html futhermore display on site
					scoreDisplay.innerHTML = score;
					row.forEach(index => {
						squares[index].classList.remove('taken');
						squares[index].classList.remove('tetromino');
						squares[index].style.backgroundColor = '';
					})
					// create nee empty row div
					const squaresRemoved = squares.splice(i, width);

					// join new row with our squares
					squares = squaresRemoved.concat(squares);
					// append all cells to grid
					console.log(squares);
					squares.forEach(cell => {
						grid.appendChild(cell)
					console.log(cell);
					});
			}
		}
		}
	}
	const gameOver = () => {
		if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
			scoreDisplay.innerHTML = 'game over';
			clearInterval(timeId);

		}


	}
});


