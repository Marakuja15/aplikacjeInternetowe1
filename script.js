const btnLocation = document.getElementById('request-location');
const btnNotify = document.getElementById('request-notification');
const btnMyLocation = document.getElementById('my-location');
const btnDownload = document.getElementById('download-map');
const btnStartPuzzle = document.getElementById('start-puzzle');
let map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS popup.<br> Easily customizable.')
    .openPopup();
let lat;
let lng;
let mapImageData = null;
let pieces = [];
let slots = [];

btnLocation.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Lokalizacja przyznana');
                lat = position.coords.latitude;
                lng = position.coords.longitude;
            },
            (error) => {
                alert('Could not get location');
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

btnNotify.addEventListener('click', () => {
    if ('Notification' in window) {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                new Notification('Sukces!', {
                    body: 'Powiadomienia działają',
                });
            } else if (permission === 'denied') {
                alert('No notifications');
            } else {
                alert('No decision');
            }
        });
    } else {
        alert('error');
    }
});

btnMyLocation.addEventListener('click', () => {
    if (lat && lng) {
        map.setView([lat, lng], 13);
        L.marker([lat, lng]).addTo(map)
            .bindPopup('Twoja lokalizacja')
            .openPopup();
    }
});

btnDownload.addEventListener('click', () => {
    if (!map) {
        alert('No map');
        return;
    }
    const mapElement = document.getElementById('map');
    const controls = document.querySelectorAll('.leaflet-control-container');
    controls.forEach(control => control.style.display = 'none');

    setTimeout(() => {
        html2canvas(mapElement, {
            useCORS: true,
            allowTaint: true,
            logging: true
        }).then(canvas => {
            mapImageData = canvas.toDataURL('image/png');
            document.getElementById('start-puzzle').disabled = false;
            alert('Map is ready.');
        }).catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error.message);
        }).finally(() => {
            controls.forEach(control => control.style.display = '');
        });
    }, 1000);
});

btnStartPuzzle.addEventListener('click', () => {
    if (!mapImageData) {
        alert('Najpierw pobierz mapę');
        return;
    }

    document.getElementById('puzzle-area').classList.remove('hidden');
    createPuzzle();
});

function handleAreaDrop(e) {
    e.preventDefault();
    const pieceIndex = e.dataTransfer.getData('text/html');
    if (!pieceIndex) return;

    const piece = pieces[pieceIndex];
    if (!piece) return;

    if (piece.dataset.currentSlotIndex) {
        const oldSlot = slots[piece.dataset.currentSlotIndex];
        delete oldSlot.dataset.occupied;
        delete piece.dataset.currentSlotIndex;
    }

    const table = document.getElementById('puzzle-table');
    const tableRect = table.getBoundingClientRect();
    const pieceSize = 100;

    piece.style.left = (e.clientX - tableRect.left - pieceSize / 2) + 'px';
    piece.style.top = (e.clientY - tableRect.top - pieceSize / 2) + 'px';

    piece.classList.remove('correct');
    piece.style.borderColor = '#333';

    checkIfComplete();
}

function createPuzzle() {
    const table = document.getElementById('puzzle-table');
    table.innerHTML = '';
    table.addEventListener('dragover', (e) => e.preventDefault());
    table.addEventListener('drop', handleAreaDrop);
    pieces = [];
    slots = [];

    const pieceSize = 100;
    const gridSize = pieceSize * 4;

    const grid = document.createElement('div');
    grid.id = 'puzzle-grid';
    grid.style.cssText = `
        position: absolute;
        top: 20px;
        left: 20px;
        width: ${gridSize}px;
        height: ${gridSize}px;
        display: grid;
        grid-template-columns: repeat(4, ${pieceSize}px);
        grid-template-rows: repeat(4, ${pieceSize}px);
        gap: 0;
        border: 3px solid #333;
    `;

    for (let i = 0; i < 16; i++) {
        const row = Math.floor(i / 4);
        const col = i % 4;

        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.style.cssText = `
            background: rgba(200, 200, 200, 0.3);
            border: 1px solid #999;
        `;
        slot.dataset.row = row;
        slot.dataset.col = col;
        slot.dataset.index = i;

        slot.addEventListener('dragover', (e) => e.preventDefault());
        slot.addEventListener('drop', (e) => {
            e.stopPropagation();
            handleDrop(e);
        });

        grid.appendChild(slot);
        slots.push(slot);
    }
    table.appendChild(grid);

    for (let i = 0; i < 16; i++) {
        const row = Math.floor(i / 4);
        const col = i % 4;

        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.draggable = true;

        piece.style.cssText = `
            position: absolute;
            width: ${pieceSize}px;
            height: ${pieceSize}px;
            background-image: url(${mapImageData});
            background-size: ${gridSize}px ${gridSize}px;
            background-position: -${col * pieceSize}px -${row * pieceSize}px;
            cursor: move;
            border: 2px solid #333;
        `;

        piece.style.left = (20 + Math.random() * 600) + 'px';
        piece.style.top = (gridSize + 100 + Math.random() * 200) + 'px';

        piece.dataset.correctRow = row;
        piece.dataset.correctCol = col;
        piece.dataset.correctIndex = i;

        piece.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', e.target.dataset.correctIndex);
            e.target.style.opacity = '0.4';
        });

        piece.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
        });

        table.appendChild(piece);
        pieces.push(piece);
    }

    console.log('Puzzle created');
}

function handleDrop(e) {
    e.preventDefault();

    const pieceIndex = e.dataTransfer.getData('text/html');
    const piece = pieces[pieceIndex];
    const slot = e.currentTarget;

    if (slot.dataset.occupied) {
        return;
    }

    if (piece.dataset.currentSlotIndex) {
        const oldSlot = slots[piece.dataset.currentSlotIndex];
        delete oldSlot.dataset.occupied;
    }

    const slotRect = slot.getBoundingClientRect();
    const tableRect = document.getElementById('puzzle-table').getBoundingClientRect();

    piece.style.left = (slotRect.left - tableRect.left) + 'px';
    piece.style.top = (slotRect.top - tableRect.top) + 'px';

    slot.dataset.occupied = 'true';
    piece.dataset.currentSlotIndex = slot.dataset.index;

    if (slot.dataset.index === piece.dataset.correctIndex) {
        piece.classList.add('correct');
        piece.style.borderColor = 'green';
    } else {
        piece.classList.remove('correct');
        piece.style.borderColor = '#333';
    }

    checkIfComplete();
}

function checkIfComplete() {
    const allCorrect = pieces.every(piece => piece.classList.contains('correct'));

    if (allCorrect) {
        console.log('COMPLETE!');

        if (Notification.permission === 'granted') {
            new Notification('Gratulacje!', {
                body: 'Ułożyłeś wszystkie puzzle',
            });
        } else {
            alert('Gratulacje');
        }
    }
}