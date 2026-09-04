const { ipcRenderer } = require('electron');
const postit = document.getElementById('postit');
const closeBtn = document.getElementById('close-btn');
const dots = document.querySelectorAll('.dot');
const colorDots = document.getElementById('color-dots');
const addBtn = document.getElementById('add-btn');
const upArrowBtn = document.getElementById('up-arrow');
const downArrowBtn = document.getElementById('down-arrow')

const COLS = 5;
const ROWS = 6;
let currentRow = 0; // show dots

//
function setTile(el, col, row) {
    const posX = (col / (COLS - 1)) * 100;
    const posY = (row / (ROWS - 1)) * 100;
    el.style.backgroundPosition = `${posX}% ${posY}%`;
}

function updateDots() {
    dots.forEach(dot => {
        const col = parseInt(dot.dataset.col);
        setTile(dot, col, currentRow);
    });
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const col = parseInt(dot.dataset.col);
        setTile(postit, col, currentRow);
        postit.dataset.col = col;
        postit.dataset.row = currentRow;
    });
});

upArrowBtn.addEventListener('click', () => {
    currentRow = (currentRow - 1 + ROWS) % ROWS;
    updateDots();
})

downArrowBtn.addEventListener('click', () => {
    currentRow = (currentRow + 1 + ROWS) % ROWS;
    updateDots();
})

updateDots();

// Initial color: row 0, col 0
setTile(postit, 0, 0); 

closeBtn.addEventListener('click', () => {
    window.close();
});

addBtn.addEventListener('click', () => {
    ipcRenderer.send('create-postit');
})