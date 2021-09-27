
const header = document.querySelector(".header")
const hero = document.querySelector('.hero');
const ghost = document.querySelector('.ghost');
const treasure = document.querySelector('.treasure');
const resultDiv = document.querySelector('.result');
const btn = document.querySelector(".btn")

// intializing the coordinates variables
let heroCoordinates;
let ghostCoordinates;
let treasureCoordinates;

// getting random coordinates of hero, ghost and treasure
const getRandomCoordinates = () => {

 const random = (coordinate) =>
  coordinate === "x" ? (Math.floor(Math.random() * (8 - 1)) + 1) : (Math.floor(Math.random() * (6 - 1)) + 1);

 heroCoordinates = [random("x"), random("y")]
 ghostCoordinates = [random("x"), random("y")]
 treasureCoordinates = [random("x"), random("y")]

}

// getting initial coordinates of hero, ghost and treasure upon page refresh (randomly)
const getInitialCoordinates = () => {

 // the while loops prevent either of hero, ghost and treasure to appear on the same place because if they do, they are assigned new random coordinates
 while (
  JSON.stringify(heroCoordinates) === JSON.stringify(ghostCoordinates) || JSON.stringify(heroCoordinates) === JSON.stringify(treasureCoordinates) || JSON.stringify(ghostCoordinates) === JSON.stringify(treasureCoordinates)
 ) {
  getRandomCoordinates();
 }
}

// get the intial coordinates of hero, ghost and treasure
getInitialCoordinates();


// intializing the pixels variables
let heroPixels;
let ghostPixels;
let treasurePixels;


// transform coordinates to string that include pixels
const getPixels = (coordinates) => {

 let x;
 let y;

 x = `${(coordinates[0] - 1) * 100}px`
 y = `${(coordinates[1] - 1) * 100}px`

 // return the resulting pixels array
 return [x, y]

}

// getting the initial pixels coordinates of hero, ghost and treasure
heroPixels = getPixels(heroCoordinates)
ghostPixels = getPixels(ghostCoordinates)
treasurePixels = getPixels(treasureCoordinates)

// initialize the hero, ghost and treasure at their initial pixel coordinates
hero.style.left = heroPixels[0]
hero.style.bottom = heroPixels[1];

ghost.style.left = ghostPixels[0]
ghost.style.bottom = ghostPixels[1]

treasure.style.left = treasurePixels[0]
treasure.style.bottom = treasurePixels[1]


// store the result variable showing victory or loss
let result = false;


// move the hero with arrows or WASD keys, provided the X coordinate must be no bigger than 8 and Y coordinate must be no bigger than 6. If the hero won or lost, the condition !result returns false which will disable the hero's ability to move
const moveHero = (e) => {

 if (
  (e.code === "KeyW" || e.code === "ArrowUp") && heroCoordinates[1] < 6 && !result
 ) {
  heroCoordinates = [heroCoordinates[0], heroCoordinates[1] + 1]

 }
 else if (
  (e.code === "KeyS" || e.code === "ArrowDown") && heroCoordinates[1] > 1 && !result
 ) {
  heroCoordinates = [heroCoordinates[0], heroCoordinates[1] - 1]

 }
 else if (
  (e.code === "KeyA" || e.code === "ArrowLeft") && heroCoordinates[0] > 1 && !result
 ) {
  heroCoordinates = [heroCoordinates[0] - 1, heroCoordinates[1]]

 }
 else if (
  (e.code === "KeyD" || e.code === "ArrowRight") && heroCoordinates[0] < 8 && !result
 ) {
  heroCoordinates = [heroCoordinates[0] + 1, heroCoordinates[1]]
 }

 // getting the corresponding pixels to the current coordinates and moving the hero to his position
 heroPixels = getPixels(heroCoordinates)
 hero.style.left = heroPixels[0]
 hero.style.bottom = heroPixels[1]

 // if the coordinates of the hero and treasure are equal, hero wins
 if (JSON.stringify(heroCoordinates) === JSON.stringify(treasureCoordinates)) {
  result = "victory";
  showResult(result);
 }

 // if the coordinates of hero and ghost are equal, hero loses
 if (JSON.stringify(heroCoordinates) === JSON.stringify(ghostCoordinates)) {
  result = "loss";
  showResult(result);
 }

}

// the ghost's movements
const moveGhost = () => {

 // ghost has 4 initial options whre he can go
 // top, bottom, right, left
 let options = [[0, 1], [0, -1], [1, 0], [-1, 0]]


 // the ghost compares his coordinates with hero's coordinates and moves closer - his options get narrower
 // as it moves closer to the hero who is always on the map, ghost cannot step outside of the map

 // the ghost narrows down his options and thus modifies the options array accordingly

 // 1) if the ghost is on the left of the hero
 if (ghostCoordinates[0] < heroCoordinates[0]) {
  // 1.a) if the ghost is on the left and below the hero, he can choose to go up or right
  if (ghostCoordinates[1] < heroCoordinates[1]) {
   options = [[0, 1], [1, 0]]
  }
  // 1.b) if the ghost is on the left and above the hero, he can choose to go down or right
  else if (ghostCoordinates[1] > heroCoordinates[1]) {
   options = [[0, -1], [1, 0]]
  }
  // 1.c) if the ghost is on the left but on the same level as the hero, he can only choose to go right
  else if (ghostCoordinates[1] === heroCoordinates[1]) {
   options = [[1, 0]]
  }
 }
 // 2) if the ghost on the right of the hero
 else if (ghostCoordinates[0] > heroCoordinates[0]) {
  // 2.a) if the ghost is on the right and below the hero, he can choose to go up or left
  if (ghostCoordinates[1] < heroCoordinates[1]) {
   options = [[0, 1], [-1, 0]]
  }
  // 2.b) if the ghost is on the right and below the hero, he can choose to go down or left
  else if (ghostCoordinates[1] > heroCoordinates[1]) {
   options = [[0, -1], [-1, 0]]
  }
  // 2.c) if the ghost is on the right but on the same level as the hero, he can only choose to go left
  else {
   options = [[-1, 0]]
  }
 }
 // 3) if the ghost is just below or above the hero
 else if (ghostCoordinates[0] === heroCoordinates[0]) {
  // 3.a) if the ghost is just above the hero, he can only choose to go down
  if (ghostCoordinates[1] > heroCoordinates[1]) {
   options = [[0, -1]]
  }
  // 3.b) if the ghost is just below the hero, he can only choose to go down
  else if (ghostCoordinates[1] < heroCoordinates[1]) {
   options = [[0, 1]]
  }
 }


 // ghost choses the direction randomly from the options array
 const index = Math.floor(Math.random() * options.length)
 const choice = options[index];

 // ghost moves to the new coordinate that he has randomly chosen (coordinate on the respective axis goes either up or down)
 ghostCoordinates = ghostCoordinates.map((initialCoordinate, i) =>
  // this only adds/reduces one of the coordinate values by 1
  initialCoordinate + choice[i]
 )

 // getting the corresponding pixels to the current coordinates and moving the ghost to his position
 ghostPixels = getPixels(ghostCoordinates)
 ghost.style.left = ghostPixels[0]
 ghost.style.bottom = ghostPixels[1]

 // if the coordinates of the hero and ghost are equal, hero loses
 if (JSON.stringify(heroCoordinates) === JSON.stringify(ghostCoordinates)) {
  result = "loss";
  showResult(result);
 }

}

// show result on the map and in the header, and unhide the PLAY AGAIN button
const showResult = (result) => {
 if (result === "victory") {
  resultDiv.style.left = heroPixels[0];
  resultDiv.style.bottom = heroPixels[1];
  resultDiv.classList.add("result--victory")
  // stopping the ghost's movement
  clearInterval(interval);
  header.innerHTML = "YOU WON"
  document.querySelector("body").style.background = "rgba(0, 255, 0, 0.5)"
 }
 else if (result === "loss") {
  resultDiv.style.left = heroPixels[0];
  resultDiv.style.bottom = heroPixels[1];
  resultDiv.classList.add("result--loss");
  // stopping the ghost's movement
  clearInterval(interval)
  header.innerHTML = "YOU LOST"
  document.querySelector("body").style.background = "rgba(255, 0, 0, 0.5)"
 }

 // show the PLAY AGAIN button upon victory/loss
 btn.style.display = "block"
}

// reloading the page and hiding the PLAY AGAIN button
const reloadPage =
 () => {
  window.location.reload();
  btn.style.display = "none"
 }

// setting the ghost to motion, at each time interval it calls the moveGhost function
const interval = setInterval(moveGhost, 200)

// enabling hero to move
document.addEventListener("keydown", moveHero)


// adding functionality to the PLAY AGAIN button - either clicking on the button, or pressing Enter/Space keys runs the reloadPage function
btn.addEventListener("click", reloadPage)
document.addEventListener("keydown", (e) => {
 if ((e.code === "Enter" || e.code === "Space") && btn.style.display === "block") {
  reloadPage()
 }
})

