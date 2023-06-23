const menu = document.querySelector(".tetris__menu");
const playingBtn = document.querySelector(".tetris__playingBtn");
const checkBtn = document.querySelector(".tetris__checkBtn");
const nextItemBox = document.querySelector(".tetris__nextItemBox");
const playingBox = document.querySelector(".tetris__playingBox");
const scoreBox = document.querySelector(".tetris__scoreBox");

function playGame(e) {
  console.log(e);
  menu.style.display = "none";
}

playingBtn.addEventListener("click", playGame);
console.log(menu);
