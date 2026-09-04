const { ipcRenderer } = require('electron');
const postit = document.getElementById('postit');
const closeBtn = document.getElementById('close-btn');
const dots = document.querySelectorAll('.dot');
const colorDots = document.getElementById('color-dots');
const addBtn = document.getElementById('add-btn');
const upArrowBtn = document.getElementById('up-arrow');
const downArrowBtn = document.getElementById('down-arrow');
const textArea = document.getElementById('postit-text');

const COLS = 5;
const ROWS = 6;
let currentRow = 0;

const params = new URLSearchParams(window.location.search);
const postitId = params.get('id');

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

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const saveText = debounce(() => {
  ipcRenderer.send('update-postit', postitId, { text: textArea.value });
}, 400);

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        const col = parseInt(dot.dataset.col);
        setTile(postit, col, currentRow);
        ipcRenderer.send('update-postit', postitId, { col, row: currentRow });
    });
});

upArrowBtn.addEventListener('click', () => {
    currentRow = (currentRow - 1 + ROWS) % ROWS;
    updateDots();
});

downArrowBtn.addEventListener('click', () => {
    currentRow = (currentRow + 1) % ROWS;
    updateDots();
});

colorDots.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (e.deltaY > 0) {
    currentRow = (currentRow + 1) % ROWS;
  } else {
    currentRow = (currentRow - 1 + ROWS) % ROWS;
  }
  updateDots();
});

textArea.addEventListener('input', saveText);

closeBtn.addEventListener('click', () => {
    ipcRenderer.send('delete-postit', postitId);
});

addBtn.addEventListener('click', () => {
    ipcRenderer.send('create-postit');
});

(async () => {
  const state = await ipcRenderer.invoke('get-postit-data', postitId);

  if (state.text) textArea.value = state.text;

  const col = state.col ?? 0;
  const row = state.row ?? 0;
  currentRow = row;
  setTile(postit, col, row);
  updateDots();
})();