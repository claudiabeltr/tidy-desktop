const { ipcRenderer } = require('electron');

// --- DOM references ---
const postit = document.getElementById('postit');
const closeBtn = document.getElementById('close-btn');
const addBtn = document.getElementById('add-btn');
const dots = document.querySelectorAll('.dot');
const colorDots = document.getElementById('color-dots');
const upArrowBtn = document.getElementById('up-arrow');
const downArrowBtn = document.getElementById('down-arrow');
const textArea = document.getElementById('postit-text');

// --- Tileset grid ---
const COLS = 5;
const ROWS = 6;
let currentRow = 0;

const postitId = new URLSearchParams(window.location.search).get('id');

function setTile(el, col, row) {
  const posX = (col / (COLS - 1)) * 100;
  const posY = (row / (ROWS - 1)) * 100;
  el.style.backgroundPosition = `${posX}% ${posY}%`;
}

function updateDots() {
  dots.forEach(dot => setTile(dot, parseInt(dot.dataset.col), currentRow));
}

function changeRow(direction) {
  currentRow = (currentRow + direction + ROWS) % ROWS;
  updateDots();
}

// --- Persistence ---
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

async function restoreState() {
  const state = await ipcRenderer.invoke('get-postit-data', postitId);

  if (state.text) textArea.value = state.text;

  currentRow = state.row ?? 0;
  setTile(postit, state.col ?? 0, currentRow);
  updateDots();
}

// --- Event listeners ---
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const col = parseInt(dot.dataset.col);
    setTile(postit, col, currentRow);
    ipcRenderer.send('update-postit', postitId, { col, row: currentRow });
  });
});

upArrowBtn.addEventListener('click', () => changeRow(-1));
downArrowBtn.addEventListener('click', () => changeRow(1));

colorDots.addEventListener('wheel', (e) => {
  e.preventDefault();
  changeRow(e.deltaY > 0 ? 1 : -1);
});

textArea.addEventListener('input', saveText);

closeBtn.addEventListener('click', () => {
  ipcRenderer.send('delete-postit', postitId);
});

addBtn.addEventListener('click', () => {
  ipcRenderer.send('create-postit');
});

// --- Init ---
restoreState();