document.addEventListener('DOMContentLoaded', () => {

  const grid = document.querySelector('.grid');
  const scoreDisplay = document.getElementById('score');
  const highScoreDisplay = document.getElementById('highScore');
  const width = 8;
  const candyPlaceholders = [];
  let score = 0;
  let hiScore;

  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

  const candyImages = [
    'url(images/red-candy.png)',
    'url(images/yellow-candy.png)',
    'url(images/orange-candy.png)',
    'url(images/purple-candy.png)',
    'url(images/green-candy.png)',
    'url(images/blue-candy.png)'
  ];

  //create your board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const candyPlaceholder = document.createElement('div')
      candyPlaceholder.setAttribute('draggable', true)
      candyPlaceholder.setAttribute('id', i)
      let randomColor = Math.floor(Math.random() * candyImages.length)
      candyPlaceholder.style.backgroundImage = candyImages[randomColor]
      grid.appendChild(candyPlaceholder)
      candyPlaceholders.push(candyPlaceholder)
    }
    registerDragEvents();
  }

  function registerDragEvents() {
    candyPlaceholders.forEach(candyPlaceholder => candyPlaceholder.addEventListener('dragstart', dragStart));
    candyPlaceholders.forEach(candyPlaceholder => candyPlaceholder.addEventListener('dragend', dragEnd));
    candyPlaceholders.forEach(candyPlaceholder => candyPlaceholder.addEventListener('dragover', dragOver));
    candyPlaceholders.forEach(candyPlaceholder => candyPlaceholder.addEventListener('dragenter', dragEnter));
    candyPlaceholders.forEach(candyPlaceholder => candyPlaceholder.addEventListener('drageleave', dragLeave));
    candyPlaceholders.forEach(candyPlaceholder => candyPlaceholder.addEventListener('drop', dragDrop));
  }
// Drag events start
  function dragStart() {
    colorBeingDragged = this.style.backgroundImage
    squareIdBeingDragged = parseInt(this.id)
  }

  function dragOver(e) {
    e.preventDefault()
  }

  function dragEnter(e) {
    e.preventDefault()
  }

  function dragLeave() {
    this.style.backgroundImage = ''
  }

  function dragDrop() {
    colorBeingReplaced = this.style.backgroundImage
    squareIdBeingReplaced = parseInt(this.id)
    this.style.backgroundImage = colorBeingDragged
    candyPlaceholders[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced
  }

  function dragEnd() {
    let validMoves = [squareIdBeingDragged - 1, squareIdBeingDragged - width, squareIdBeingDragged + 1, squareIdBeingDragged + width]
    let validMove = validMoves.includes(squareIdBeingReplaced)

    if (squareIdBeingReplaced) {
      if (validMove) {
        squareIdBeingReplaced = null;
      } else {
        candyPlaceholders[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced
        candyPlaceholders[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
      }
    } else candyPlaceholders[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
  }
// Drag events end

  function isBlankSquare(index) {
    return candyPlaceholders[index].style.backgroundImage === ''
  }

  function moveIntoSquareBelow() {
    for (i = 0; i < width * (width - 1); i++) {
      const firstRow = Array.from(Array(width).keys());
      const isFirstRow = firstRow.includes(i)

      if (candyPlaceholders[i + width].style.backgroundImage === '') {
        candyPlaceholders[i + width].style.backgroundImage = candyPlaceholders[i].style.backgroundImage
        candyPlaceholders[i].style.backgroundImage = '';

        if (isFirstRow && isBlankSquare(i)) {
          let randomColor = Math.floor(Math.random() * candyImages.length)
          candyPlaceholders[i].style.backgroundImage = candyImages[randomColor]
        }
      }
      if (isFirstRow && isBlankSquare(i)) {
        let randomColor = Math.floor(Math.random() * candyImages.length)
        candyPlaceholders[i].style.backgroundImage = candyImages[randomColor]
      }
    }
  }

  function checkRowForN(count) {
    for (i = 0; i < (width * width) - count + 1; i++) {
      const notValid = getNotValidSquares(count);
      if (notValid.includes(i)) {
        continue;
      }

      let rowOfN = getRowOfN(i, count);
      checkAndUpdateScore(rowOfN, count, i);
    }
  }

  function checkColumnForN(count) {
    for (i = 0; i < width * (width - count + 1); i++) {
      let columnOfN = getColumnOfN(i, count);
      let decidedColor = candyPlaceholders[i].style.backgroundImage
      const isBlank = isBlankSquare(i);

      if (columnOfN.every(index => candyPlaceholders[index].style.backgroundImage === decidedColor && !isBlank)) {
        score += count;
        updateScore();
        columnOfN.forEach(index => {
          candyPlaceholders[index].style.backgroundImage = ''
        });
      }
    }
  }

  function getNotValidSquares(count) {
    const firstRow = Array.from(Array(width * width).keys());
    return firstRow.filter(i => i % width > width - count);
  }

  function checkAndUpdateScore(rowOfN, count, index) {
    let decidedColor = candyPlaceholders[index].style.backgroundImage
    const isBlank = isBlankSquare(index);
    if (rowOfN.every(item => candyPlaceholders[item].style.backgroundImage === decidedColor && !isBlank)) {
      score += count;
      updateScore();
      rowOfN.forEach(item => {
        candyPlaceholders[item].style.backgroundImage = ''
      });
    }
  }

  function getRowOfN(offset, count) {
    return Array(count).fill().map((_, index) => offset + index);
  }

  function getColumnOfN(offset, count) {
    return Array(count).fill().map((_, index) => offset + index * width);
  }

  function updateScore() {
    scoreDisplay.innerHTML = score;
    if (score > hiScore) {
      hiScore = score;
      localStorage.setItem("highScore", JSON.stringify(hiScore));
      highScoreDisplay.innerHTML = hiScore;
    }
  }

  function readHighScroe() {
    hiScore = localStorage.getItem("highScore");
    if (hiScore === null) {
      hiScore = 0;
      localStorage.setItem("highScore", JSON.stringify(hiScore))
    }
    else {
      hiScore = JSON.parse(hiScore);
      highScoreDisplay.innerHTML = hiScore;
    }
  }

  function init() {
    createBoard();
    readHighScroe();
    checkRowForN(5);
    checkColumnForN(5);
    checkRowForN(4);
    checkColumnForN(4);
    checkRowForN(3);
    checkColumnForN(3);
  }

  init();

  // continue checking if match found for every 100ms
  window.setInterval(function () {
    checkRowForN(5);
    checkColumnForN(5);
    checkRowForN(4);
    checkColumnForN(4);
    checkRowForN(3);
    checkColumnForN(3);
    moveIntoSquareBelow();
  }, 100)
});
