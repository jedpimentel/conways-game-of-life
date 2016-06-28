Testing SASS/React
Originally created as part of the freecodecamp.com curriculum.
https://www.freecodecamp.com/challenges/build-the-game-of-life

User Story: When I first arrive at the game, it will randomly generate a board and start playing.

User Story: I can start and stop the board.

User Story: I can set up the board.

User Story: I can clear the board.

User Story: When I press start, the game will play out.

User Story: Each time the board changes, I can see how many generations have gone by.


good to haves:
	ability to click nd drag over different squares and haven them all activated instead of clicking one at a time
	newly born cells have a lighter/different color on their first turn of life.
	use SVG instead of divs for cells


note to self: 

npm install babel-preset-es2015 babel-preset-react

start /b sass --watch source:public & ^
start /b babel --presets es2015,react --watch source/ --out-dir public/  & ^
start /b http-server ./
