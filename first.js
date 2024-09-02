
const soldierImages = [
    './assets/Designer__1_-removebg-preview.png',
    './assets/Designer__2_-removebg-preview.png',
    './assets/Designer__3_-removebg-preview.png',
    './assets/Designer__4_-removebg-preview (1).png',
    './assets/Designer__5_-removebg-preview.png',
    './assets/Designer__6_-removebg-preview.png',
    './assets/Designer__7_-removebg-preview.png'
    // הוסף כאן את נתיבי התמונות שלך
];
document.getElementById('backButton').addEventListener('click', function () {
    window.location.href = './start.html'; // ניתוב לעמוד הראשי
});
function createPlayerInputs() {
    const playerCount = parseInt(document.getElementById('playerCount').value, 10);
    const overlay = document.getElementById('overlay');
    const playerNamesContainer = document.getElementById('playerNames');

    // סגור את ה-overlay
    overlay.style.display = 'none';

    if (!isNaN(playerCount) && playerCount > 0 && playerCount <= soldierImages.length) {
        // יצירת שדות הכנסת שמות
        playerNamesContainer.innerHTML = '<h2>הכנס את שמות המשתתפים</h2>';

        for (let i = 0; i < playerCount; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `שם שחקן ${i + 1}`;
            input.id = `playerName${i + 1}`;
            playerNamesContainer.appendChild(input);
        }

        const button = document.createElement('button');
        button.innerText = 'הצג חיילים';
        button.onclick = () => displaySoldiers(playerCount);
        playerNamesContainer.appendChild(button);

        playerNamesContainer.style.display = 'block';
    } else {
        alert('מספר המשתתפים אינו תקין או שיש יותר משתתפים מתמונות החיילים.');
    }
}
function createPlayerInputsGroup() {
    const playerCount = parseInt(document.getElementById('playerCount').value, 10);
    const overlay = document.getElementById('overlay');
    const playerNamesContainer = document.getElementById('playerNames');

    // סגור את ה-overlay
    overlay.style.display = 'none';

    if (!isNaN(playerCount) && playerCount > 0 && playerCount <= soldierImages.length) {
        // יצירת שדות הכנסת שמות
        playerNamesContainer.innerHTML = '<h2>הכנס את שמות הקבוצות</h2>';

        for (let i = 0; i < playerCount; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `שם קבוצה ${i + 1}`;
            input.id = `playerName${i + 1}`;
            playerNamesContainer.appendChild(input);
        }

        const button = document.createElement('button');
        button.innerText = 'הצג חיילים';
        button.onclick = () => displaySoldiers(playerCount);
        playerNamesContainer.appendChild(button);

        playerNamesContainer.style.display = 'block';
    } else {
        alert('מספר הקבוצות אינו תקין או שיש יותר משתתפים מתמונות החיילים.');
    }
}
function displaySoldiers(playerCount) {
    const soldiersContainer = document.getElementById('soldiers');
    const playerNamesContainer = document.getElementById('playerNames');
    const gamePage = document.getElementById('gamePage');
const players=[];
    soldiersContainer.innerHTML = '';

    playerNamesContainer.style.display = 'none';

    gamePage.style.display = 'block';

    const shuffledImages = soldierImages.slice(0, playerCount).sort(() => Math.random() - 0.5);

    for (let i = 0; i < playerCount; i++) {
        const playerName = document.getElementById(`playerName${i + 1}`).value;

        if (playerName) {
            const soldierDiv = document.createElement('div');
            soldierDiv.className = 'soldier';

            const img = document.createElement('img');
            img.src = shuffledImages[i];
            img.alt = 'חייל';

            const name = document.createElement('p');
            name.innerText = playerName;

            soldierDiv.appendChild(img);
            soldierDiv.appendChild(name);

            soldiersContainer.appendChild(soldierDiv);
            players.push({ name: playerName, soldier: shuffledImages[i],id: i,currentCell:1});

        }

    }
    localStorage.setItem('players', JSON.stringify(players));

}

function goToGamePage() {
    window.location.href = './play.html'; 
}
function goToGamePageGroup() {
    window.location.href = './play-group.html'; 
}