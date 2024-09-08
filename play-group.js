
let diceResult = null;
let currentPlayerIndex = 0;
let intervalId;
let isTimerRunning = false; 

document.getElementById('backButton').addEventListener('click', function () {
    window.location.href = './index.html'; // ניתוב לעמוד הראשי
});
function placePlayerOnStartingCell(playerDiv) {
    const startingCell = document.querySelector(`#cell-1`);
    if (startingCell) {
        playerDiv.style.position = 'absolute';


        const centerX = startingCell.offsetLeft + (startingCell.offsetWidth / 2) - (playerDiv.offsetWidth / 2);
        const centerY = startingCell.offsetTop + (startingCell.offsetHeight / 2) - (playerDiv.offsetHeight / 2);

        playerDiv.style.left = `${centerX}px`;
        playerDiv.style.top = `${centerY}px`;
    } else {
        console.error("משבצת התחלה לא נמצאה.");
    }
}

function rollDiceAndMovePlayers() {
    console.log(diceResult);
    if (diceResult === null) {
        console.error("לא נזרקה קוביה. יש לוודא שהקוביה נזרקה קודם.");
        return;
    }

    const players = document.querySelectorAll('.player');
    if (players.length === 0) {
        console.error("לא נמצאו שחקנים.");
        return;
    }

    function movePlayer(playerDiv, steps) {
        let currentCellId = parseInt(playerDiv.dataset.cellId);
        let newCellId = currentCellId + steps;

        if (newCellId > 40) {
            newCellId = newCellId % 40;
            if (newCellId === 0) newCellId = 40;
        }

        playerDiv.dataset.cellId = newCellId;
        const newCell = document.querySelector(`#cell-${newCellId}`);
        if (newCell) {
            const centerX = newCell.offsetLeft + (newCell.offsetWidth / 2) - (playerDiv.offsetWidth / 2);
            const centerY = newCell.offsetTop + (newCell.offsetHeight / 2) - (playerDiv.offsetHeight / 2);

            playerDiv.style.left = `${centerX}px`;
            playerDiv.style.top = `${centerY}px`;

            checkSpecialCells(newCellId); // בדוק אם יש פעולה מיוחדת במשבצת החדשה
        } else {
            console.error(`משבצת ${newCellId} לא נמצאה.`);
        }
    }



    function moveToNextPlayer() {
        if (players.length === 0) {
            console.error("לא נמצאו שחקנים.");
            return;
        }

        // הזזת השחקן הנוכחי
        const currentPlayer = players[currentPlayerIndex];
        movePlayer(currentPlayer, diceResult);

        // עדכון האינדקס לשחקן הבא
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // איפוס האינדקס בסיום מחזור השחקנים
    }


    moveToNextPlayer();
}


function startTimer(duration, display) {
    var timer = duration * 1000;

    // בדוק אם יש כבר טיימר פעיל ונקה אותו
    if (intervalId) {
        clearInterval(intervalId);
    }
    isTimerRunning = true;
    // הפעל טיימר חדש
    intervalId = setInterval(function () {
        var minutes = parseInt(timer / 60000, 10);
        var seconds = parseInt((timer % 60000) / 1000, 10);
        var milliseconds = parseInt(timer % 1000, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        milliseconds = milliseconds < 100 ? "0" + milliseconds : milliseconds;

        display.textContent = minutes + ":" + seconds + ":" + milliseconds;

        if ((timer -= 10) < 0) {
            clearInterval(intervalId);
            display.textContent = "1:00:000";

            openAlertModal("הזמן נגמר!");
            isTimerRunning = false;

            timer = duration * 1000;

            // הוסף מאזין אירועים מחדש להפעלת הטיימר לאחר סיום
            display.addEventListener('click', function () {
                startTimer(duration, display);
                display.removeEventListener('click', arguments.callee);
            });
        }
    }, 10);

    return intervalId;
}


document.addEventListener("DOMContentLoaded", function () {
    const players = JSON.parse(localStorage.getItem('players'));

    if (players && players.length > 0) {
        let playerOrderMessage = "סדר השחקנים הוא<br>";

        players.forEach((player, index) => {
            playerOrderMessage += `${player.name}<span style="margin-left: 0px;"></span><br>`;
        });

        const playerOrderElement = document.getElementById('player-order-message');
        playerOrderElement.innerHTML = playerOrderMessage;
    } else {
        console.error('לא נמצאו שחקנים ב-localStorage.');
    }

    const diceElement = document.getElementById('dice');
    diceElement.addEventListener('click', rollDice)
});



function checkSpecialCells(playerPosition) {
    const regularCells = [
        2, 4, 6, 10, 12, 14, 16, 20, 22, 24, 26, 30, 32, 34, 36, 40
    ];

    const communityChallengeCells = [5, 15, 25, 35];

    const personalChallengeCells = [11, 31];

    const milestoneCells = [7, 9, 17, 19, 27, 29, 37, 39];

    const immigrationCells = [3, 8, 13, 18, 23, 28, 33, 38];

    if (regularCells.includes(playerPosition)) {
        openAlertModal(`הגעת למשבצת אירוע היסטורי.\n
            1. קח כרטיס אירוע אנטישמי מתאים וקרא אותו בקול.
            2. הצג קלף ערך יהודי אחד או יותר כתגובה לאירוע.
            3. הסבר כיצד הערך(ים) מתמודד(ים) עם האירוע (דקה להסביר).
            4. שאר השחקנים יצביעו אם התגובה הייתה מוצלחת.
            5. אם רוב השחקנים מסכימים, קבל מטבע "חוסן יהודי".`);
    } else if (communityChallengeCells.includes(playerPosition)) {
        openAlertModal(`הגעת למשבצת אתגר קהילתי.\n
            1. קח כרטיס אתגר קהילתי וקרא אותו בקול.
            2. כל השחקנים משתתפים בדיון על כיצד להגיב לאירוע (שתי דקות).
            3. הצג את הפתרון המוסכם.
            4. אם מצליחים, קבל 2 מטבעות "חוסן יהודי", וכל השחקנים האחרים מקבלים "נקודת זכות קהילתית".`);
    } else if (personalChallengeCells.includes(playerPosition)) {
        openAlertModal(`הגעת למשבצת אתגר אישי.\n
            1. קח כרטיס אתגר אישי וקרא אותו בקול.
            2. הסבר כיצד היית מתמודד עם הסיטואציה (דקה להסביר).
            3. שאר השחקנים יצביעו אם תגובתך הייתה מוצלחת.
            4. אם רוב השחקנים מסכימים, קבל 2 מטבעות "חוסן יהודי".`);
    } else if (milestoneCells.includes(playerPosition)) {
        openAlertModal(`הגעת למשבצת ציון דרך.\n
            1. קח כרטיס ציון דרך וקרא בקול את האירוע ההיסטורי.
            2. קבל מטבע "חוסן יהודי" ללא צורך בהצגת פתרון.
            3. בחר שחקן אחר שגם יקבל מטבע "חוסן יהודי".
            4. כל השחקנים מדברים לרגע על משמעות האירוע.`);
    } else if (immigrationCells.includes(playerPosition)) {
        openAlertModal(`הגעת למשבצת עלייה לארץ.\n
            1. קח כרטיס עלייה לארץ וקרא אותו בקול.
            2. הצג פתרון לאתגר העלייה (דקה להסביר).
            3. שאר השחקנים יצביעו אם הפתרון מוצלח.
            4. אם רוב השחקנים מסכימים, קבל 2 מטבעות "חוסן יהודי" והתקדם 2 צעדים נוספים.`);
    } else {
        openAlertModal("הגעת למשבצת לא מזוהה. אנא בדוק את הלוח.");
    }
}


function openAlertModal(message) {
    const modal = document.getElementById("alertModal");
    const alertText = document.getElementById("alertText");
    const closeModal = document.getElementById("closeModal");
    const closeButton = document.getElementById("closeButton");

    alertText.innerText = message;
    modal.style.display = "flex"; // מציג את המודאל

    // סגירת המודאל בלחיצה על ה-X
    closeModal.onclick = function () {
        modal.style.display = "none";
    };

    closeButton.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            modal.style.display = "none";
        }
    });
}
 function rollDice() {
    if (isTimerRunning) {
        openAlertModal("הטיימר פועל! לא ניתן לזרוק את הקובייה.");
        return; // אם הטיימר פועל, עצור את הפונקציה כאן
    }
    const diceFaces = [
        './assets/dice-1.png',
        './assets/dice-2.png',
        './assets/dice-3.png',
        './assets/dice-4.png',
        './assets/dice-5.png',
        './assets/dice-6.png'
    ];
    const diceContainer = document.getElementById('dice');
    const resultDisplay = document.getElementById('result');
    const diceImage = document.getElementById('diceImage');

    diceContainer.classList.add('rolling');

    let rollInterval = setInterval(() => {
        const randomFace = Math.floor(Math.random() * diceFaces.length);
        diceImage.src = diceFaces[randomFace];
    }, 50);
    setTimeout(() => {
        clearInterval(rollInterval);
        const finalFaceIndex = Math.floor(Math.random() * diceFaces.length);
        diceImage.src = diceFaces[finalFaceIndex];
        diceContainer.classList.remove('rolling');
        diceResult = finalFaceIndex + 1;
        rollDiceAndMovePlayers();
    }, 1000);

}

window.onload = function () {
    const diceContainer = document.getElementById('dice');
    var oneMinute = 60,
        display = document.querySelector('#timer');


    display.addEventListener('click', function () {
        startTimer(oneMinute, display);

        display.removeEventListener('click', arguments.callee);
    });

    var players = JSON.parse(localStorage.getItem('players')) || [];
    var playersContainer = document.getElementById('players');

    players.forEach(function (player) {
        var playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        playerDiv.dataset.cellId = '1';
        playerDiv.innerHTML = `<img src="${player.soldier}" alt="חייל"><p>${player.name}</p>`;
        playersContainer.appendChild(playerDiv);
        placePlayerOnStartingCell(playerDiv);
    });
}
