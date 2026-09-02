const postit = document.getElementById('postit');
const closeBtn = document.getElementById('close-btn');
const dots = document.querySelectorAll('.dot');

const COLS = 5;
const ROWS = 5;

//
function setTile(el, col, row) {
    const pos = (col / (COLS - 1)) * 100;
    const postY = (row / (ROWS - 1)) * 100;
    el.style.backgroundPosition = `${posX}% ${posY}%`;
}

dots.forEach(dot => {
    const col = parseInt(dot.dataset.col);
    const row = parseInt(dot.dataset.row);
    setTile(dot, col, row);

    dot.addEventListener('click', () => {
        setTile(postit, col, row);
        postit.dataset.col = col;
        postit.dataset.row;
    });
});

// Initial color: row 0, col 0
setTile(postit, 0, 0); 

closeBtn.addEventListener('click', () => {
    window.close();
});