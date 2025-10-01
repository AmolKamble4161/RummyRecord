document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const sidebar = document.querySelector('.sidebar');

    const playerInputContainer = document.getElementById('player-input-container');
    const addPlayerBtn = document.getElementById('add-player-btn');
    const startGameBtn = document.getElementById('start-game-btn');

    const playerSetupSection = document.getElementById('player-setup');
    const gameDashboardSection = document.getElementById('game-dashboard');

    const newRoundBtn = document.getElementById('new-round-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');

    const gameDurationDisplay = document.getElementById('game-duration');
    const currentRoundDisplay = document.getElementById('current-round-display');
    const scoreTable = document.getElementById('score-table');
    const tableHeaderRow = document.getElementById('table-header-row');
    const scoreTableBody = document.getElementById('score-table-body');
    const totalPointsRow = document.getElementById('total-points-row');

    const gameOverMessage = document.getElementById('game-over-message');
    const winnerMessage = document.getElementById('winner-message');

    const overlay = document.getElementById('overlay');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // --- State Variables ---
    let players = [];
    let gameStarted = false;
    let currentRound = 0;
    let gameStartTime = null;
    let gameInterval = null; // To store setInterval ID for game duration
    let roundStartTimes = []; // Array to store start time for each round
    const POINTS_TO_BE_OUT = 250;
    const DANGER_ZONE_POINTS = 200;

    // --- Utility Functions ---

    // Function to show a modal with a message
    function showModal(title, message) {
        modalTitle.textContent = title;
        modalContent.textContent = message;
        overlay.classList.remove('hidden');
        modal.classList.remove('hidden');
    }

    // Function to hide the modal
    function hideModal() {
        overlay.classList.add('hidden');
        modal.classList.add('hidden');
    }

    // Format time for display (HH:MM:SS)
    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const pad = (num) => String(num).padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    // Calculate round duration
    function calculateRoundDuration(startTime, endTime) {
        if (!startTime || !endTime) return '00:00';
        const durationMs = endTime - startTime;
        const totalSeconds = Math.floor(durationMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const pad = (num) => String(num).padStart(2, '0');
        return `${pad(minutes)}:${pad(seconds)}`;
    }


    // --- Theme Toggle ---
    function toggleTheme() {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    }

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    themeToggle.addEventListener('click', toggleTheme);

    // --- Hamburger Menu ---
    hamburgerMenu.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('hidden', !sidebar.classList.contains('active')); // Show/hide overlay with sidebar
    });

    overlay.addEventListener('click', () => {
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.add('hidden');
        }
        hideModal(); // Also hide modal if clicked
    });

    // Sidebar navigation links (just show a modal for now)
    document.getElementById('about-link').addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.remove('active');
        overlay.classList.add('hidden');
        showModal('About Rummy Record', 'This app helps you record Rummy points for entertainment purposes. Keep track of scores and enjoy your game!');
    });

    document.getElementById('how-to-use-link').addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.remove('active');
        overlay.classList.add('hidden');
        showModal('How to Use', '1. Add player names.\n2. Click "Start Game".\n3. For each round, enter points (0, W/w for winner, D/d for dropped).\n4. Players crossing 250 points are out.\n5. The player with the lowest score at the end wins!');
    });

    document.getElementById('privacy-link').addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.remove('active');
        overlay.classList.add('hidden');
        showModal('Privacy Policy', 'Your game data is stored locally in your browser and is not collected or shared. This app is for offline use and entertainment only.');
    });

    document.getElementById('contact-link').addEventListener('click', (e) => {
        e.preventDefault();
        sidebar.classList.remove('active');
        overlay.classList.add('hidden');
        showModal('Contact', 'For support or feedback, please imagine sending a message to a friendly developer!');
    });

    modalCloseBtn.addEventListener('click', hideModal);


    // --- Player Setup ---
    let playerCount = 2; // Start with 2 players

    function createPlayerInput(index, playerName = '') {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player-input-group');
        playerDiv.setAttribute('data-player-id', index);

        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('player-name-input');
        input.placeholder = `Player Name ${index}`;
        input.value = playerName;
        input.required = true;

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-player-btn');
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.setAttribute('aria-label', `Remove Player ${index}`);
        removeBtn.addEventListener('click', () => {
            if (playerInputContainer.children.length > 2) { // Ensure at least 2 players remain
                playerDiv.remove();
            } else {
                showModal('Cannot Remove Player', 'You must have at least two players to start the game.');
            }
        });

        playerDiv.appendChild(input);
        playerDiv.appendChild(removeBtn);
        return playerDiv;
    }

    // Add initial player inputs
    playerInputContainer.appendChild(createPlayerInput(1));
    playerInputContainer.appendChild(createPlayerInput(2));

    addPlayerBtn.addEventListener('click', () => {
        playerCount++;
        playerInputContainer.appendChild(createPlayerInput(playerCount));
    });

    startGameBtn.addEventListener('click', () => {
        const nameInputs = document.querySelectorAll('.player-name-input');
        const tempPlayers = [];
        let allNamesValid = true;

        nameInputs.forEach((input, index) => {
            const name = input.value.trim();
            if (name === '') {
                allNamesValid = false;
                input.style.borderColor = 'var(--danger-color)'; // Highlight empty input
            } else {
                input.style.borderColor = 'var(--input-border)'; // Reset border color
                tempPlayers.push({
                    id: index,
                    name: name,
                    totalPoints: 0,
                    rounds: [], // Array of objects: { roundNum, points, status }
                    isOut: false
                });
            }
        });

        if (tempPlayers.length < 2) {
            showModal('Not Enough Players', 'Please add at least two players to start the game.');
            return;
        }

        if (!allNamesValid) {
            showModal('Invalid Names', 'All player names must be filled out.');
            return;
        }

        players = tempPlayers;
        startGame();
    });

    // --- Game Logic ---

    function startGame() {
        gameStarted = true;
        playerSetupSection.classList.add('hidden');
        gameDashboardSection.classList.remove('hidden');

        // Initialize game state
        currentRound = 0;
        players.forEach(p => {
            p.totalPoints = 0;
            p.rounds = [];
            p.isOut = false;
        });
        gameOverMessage.classList.add('hidden');
        winnerMessage.textContent = '';
        totalPointsRow.classList.remove('hidden'); // Ensure total row is visible

        // Start game timer
        gameStartTime = new Date();
        if (gameInterval) clearInterval(gameInterval); // Clear any existing interval
        gameInterval = setInterval(updateGameDuration, 1000);

        renderScoreTable(); // Initial table setup
        addNewRound(); // Add the first round
    }

    function updateGameDuration() {
        if (gameStartTime) {
            const elapsed = new Date() - gameStartTime;
            gameDurationDisplay.textContent = formatTime(elapsed);
        }
    }

    function renderScoreTable() {
        // Clear previous header and body
        tableHeaderRow.innerHTML = '<th>Round</th><th>Duration</th>';
        scoreTableBody.innerHTML = '';
        totalPointsRow.innerHTML = '<td>Total</td><td></td>'; // Reset total row

        // Add player names to the header and total row
        players.forEach(player => {
            const th = document.createElement('th');
            th.textContent = player.name;
            if (player.isOut) {
                th.classList.add('player-out');
            } else if (player.totalPoints >= DANGER_ZONE_POINTS) {
                th.classList.add('danger-zone');
            }
            tableHeaderRow.appendChild(th);

            const tdTotal = document.createElement('td');
            tdTotal.id = `total-points-${player.id}`;
            tdTotal.textContent = player.totalPoints;
            if (player.isOut) {
                tdTotal.classList.add('player-out');
            } else if (player.totalPoints >= DANGER_ZONE_POINTS) {
                tdTotal.classList.add('danger-zone');
            }
            totalPointsRow.appendChild(tdTotal);
        });

        // Add score rows for each round
        for (let r = 1; r <= currentRound; r++) {
            const row = scoreTableBody.insertRow();
            const roundCell = row.insertCell();
            roundCell.textContent = r;

            const durationCell = row.insertCell();
            const roundStartTime = roundStartTimes[r - 1] || null;
            const roundEndTime = (r === currentRound) ? new Date() : roundStartTimes[r] || null;
            durationCell.textContent = calculateRoundDuration(roundStartTime, roundEndTime);


            players.forEach(player => {
                const cell = row.insertCell();
                const roundData = player.rounds[r - 1]; // rounds are 0-indexed
                const currentRoundInputActive = (r === currentRound && !player.isOut);

                if (roundData) {
                    if (roundData.status === 'dropped') {
                        cell.classList.add('dropped');
                        cell.textContent = 'Dropped (25)';
                    } else if (roundData.status === 'win') {
                        cell.classList.add('win');
                        cell.textContent = 'Win (0)';
                    } else {
                        cell.textContent = roundData.points;
                    }

                    // Only allow editing for the current round if player is not out
                    if (currentRoundInputActive) {
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.value = roundData.status === 'dropped' ? 'D' : (roundData.status === 'win' ? 'W' : roundData.points);
                        input.setAttribute('data-player-id', player.id);
                        input.setAttribute('data-round-num', r);
                        input.addEventListener('change', updatePoints);
                        cell.innerHTML = ''; // Clear text content
                        cell.appendChild(input);
                    }
                } else if (currentRoundInputActive) { // For the current round, add input fields
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = 'Points';
                    input.setAttribute('data-player-id', player.id);
                    input.setAttribute('data-round-num', r);
                    input.addEventListener('change', updatePoints);
                    cell.appendChild(input);
                } else if (player.isOut) {
                    cell.classList.add('player-out');
                    cell.textContent = 'OUT';
                }
            });
        }
        updateGameStatus(); // Update player out/danger status after rendering
    }

    function addNewRound() {
        if (!gameStarted) {
            showModal('Game Not Started', 'Please start a new game first.');
            return;
        }

        // Check if all inputs for the previous round are filled (if it's not the very first round)
        if (currentRound > 0) {
            let allFilled = true;
            let winnerFound = false;
            let activePlayersCount = 0;

            players.forEach(player => {
                if (!player.isOut) {
                    activePlayersCount++;
                    const roundData = player.rounds[currentRound - 1]; // Get data for the round just completed
                    if (!roundData || (roundData.points === null && roundData.status === null)) {
                        allFilled = false;
                    }
                    if (roundData && roundData.status === 'win') {
                        winnerFound = true;
                    }
                }
            });

            if (activePlayersCount > 0 && !winnerFound && allFilled) {
                // If there are active players but no winner was marked, it's an error unless everyone dropped.
                // For simplicity, we'll allow it for now but a real Rummy game needs a winner or everyone dropping.
                // showModal('Missing Winner', 'Please mark one player as the winner (0 or W) for the previous round.');
                // return;
            }
            if (!allFilled) {
                showModal('Incomplete Round', 'Please fill in all points for the current round before adding a new one.');
                return;
            }
        }


        currentRound++;
        currentRoundDisplay.textContent = currentRound;
        roundStartTimes[currentRound - 1] = new Date(); // Record start time for the new round

        players.forEach(player => {
            if (!player.isOut) {
                player.rounds.push({
                    roundNum: currentRound,
                    points: null,
                    status: null // 'win', 'dropped', or null
                });
            } else {
                // If player is out, ensure they have a 'out' status for this round, or just push null
                player.rounds.push({
                    roundNum: currentRound,
                    points: null,
                    status: 'out'
                });
            }
        });
        renderScoreTable();
        scrollToBottom(); // Scroll to the latest round
    }

    function updatePoints(event) {
        const input = event.target;
        const playerId = parseInt(input.getAttribute('data-player-id'));
        const roundNum = parseInt(input.getAttribute('data-round-num'));
        let value = input.value.trim().toLowerCase();
        let points = null;
        let status = null;

        const playerIndex = players.findIndex(p => p.id === playerId);
        const player = players[playerIndex];

        if (player.isOut) {
            input.value = 'OUT'; // Visually reinforce
            input.disabled = true;
            return;
        }

        // Validate and interpret input
        if (value === 'd') {
            points = 25;
            status = 'dropped';
        } else if (value === 'w' || value === '0') {
            points = 0;
            status = 'win';
        } else {
            points = parseInt(value);
            if (isNaN(points) || points < 0) {
                showModal('Invalid Input', 'Please enter a valid number, "D" for dropped, or "W" / "0" for winner.');
                input.value = ''; // Clear invalid input
                return;
            }
            status = 'normal';
        }

        // Check for multiple winners in the same round
        if (status === 'win') {
            let winnerAlreadyMarked = false;
            players.forEach(p => {
                if (p.id !== playerId) { // Don't check the current player
                    const existingRoundData = p.rounds[roundNum - 1];
                    if (existingRoundData && existingRoundData.status === 'win') {
                        winnerAlreadyMarked = true;
                    }
                }
            });
            if (winnerAlreadyMarked) {
                showModal('Multiple Winners', 'Only one player can be the winner (0 points) per round.');
                input.value = ''; // Clear input for the second winner
                return;
            }
        }

        // Update player's round data
        if (player.rounds[roundNum - 1]) {
            player.rounds[roundNum - 1].points = points;
            player.rounds[roundNum - 1].status = status;
        } else {
            // This should not happen if rounds are added correctly
            player.rounds[roundNum - 1] = { roundNum: roundNum, points: points, status: status };
        }


        // Recalculate total points for all players
        players.forEach(p => {
            p.totalPoints = 0;
            p.rounds.forEach(roundData => {
                if (roundData.status !== 'out' && roundData.points !== null) { // Only sum if not 'out' and points are recorded
                    p.totalPoints += roundData.points;
                }
            });
        });

        checkGameOver(); // Check if any player is out or game over
        renderScoreTable(); // Re-render to update totals and styling
    }

    function checkGameOver() {
        let activePlayers = players.filter(p => !p.isOut);
        let playersOutThisTurn = false;

        // Check for players going out
        players.forEach(player => {
            if (!player.isOut && player.totalPoints >= POINTS_TO_BE_OUT) {
                player.isOut = true;
                playersOutThisTurn = true;
                showModal('Player Out!', `${player.name} has reached ${player.totalPoints} points and is now OUT of the game!`);
            }
        });

        activePlayers = players.filter(p => !p.isOut);

        if (activePlayers.length <= 1) { // If 0 or 1 active player remains
            endGame();
        }
    }

    function endGame() {
        gameStarted = false;
        clearInterval(gameInterval); // Stop game duration timer
        newRoundBtn.disabled = true; // Disable adding new rounds

        // Determine the winner among active players (or everyone if all out)
        let finalWinner = null;
        let minPoints = Infinity;

        // Consider only active players first
        let activePlayers = players.filter(p => !p.isOut);

        if (activePlayers.length > 0) {
            activePlayers.sort((a, b) => a.totalPoints - b.totalPoints);
            finalWinner = activePlayers[0];
            minPoints = finalWinner.totalPoints;
        } else { // All players are out, find the one with lowest score among all
            players.sort((a, b) => a.totalPoints - b.totalPoints);
            finalWinner = players[0]; // Player with lowest score even if out
            minPoints = finalWinner.totalPoints;
        }


        gameOverMessage.classList.remove('hidden');
        if (finalWinner) {
            winnerMessage.textContent = `${finalWinner.name} wins with ${finalWinner.totalPoints} points!`;
            // Add a class to the winner's total cell for special styling
            document.getElementById(`total-points-${finalWinner.id}`).classList.add('winner-game');
        } else {
            winnerMessage.textContent = 'No winner could be determined (unexpected error).';
        }

        renderScoreTable(); // Re-render one last time to apply winner styling
    }

    function updateGameStatus() {
        players.forEach(player => {
            const headerCell = tableHeaderRow.querySelector(`th:nth-child(${players.findIndex(p => p.id === player.id) + 3})`); // Player headers start from 3rd cell
            const totalCell = document.getElementById(`total-points-${player.id}`);

            // Clear previous status classes
            [headerCell, totalCell].forEach(cell => {
                if (cell) {
                    cell.classList.remove('player-out', 'danger-zone', 'winner-game');
                }
            });

            if (player.isOut) {
                [headerCell, totalCell].forEach(cell => cell && cell.classList.add('player-out'));
            } else if (player.totalPoints >= DANGER_ZONE_POINTS) {
                [headerCell, totalCell].forEach(cell => cell && cell.classList.add('danger-zone'));
            }
        });
    }

    function scrollToBottom() {
        scoreTableBody.scrollTop = scoreTableBody.scrollHeight;
    }


    // --- Event Listeners for Game Controls ---
    newRoundBtn.addEventListener('click', addNewRound);

    clearAllBtn.addEventListener('click', () => {
        showModal('Confirm Clear All', 'Are you sure you want to clear all game data? This cannot be undone.', () => {
            // Logic to clear all data
            players = [];
            gameStarted = false;
            currentRound = 0;
            gameStartTime = null;
            roundStartTimes = [];
            clearInterval(gameInterval);
            gameDurationDisplay.textContent = '00:00:00';
            currentRoundDisplay.textContent = '0';

            playerInputContainer.innerHTML = '';
            playerInputContainer.appendChild(createPlayerInput(1));
            playerInputContainer.appendChild(createPlayerInput(2));
            playerCount = 2; // Reset player counter

            gameDashboardSection.classList.add('hidden');
            playerSetupSection.classList.remove('hidden');
            gameOverMessage.classList.add('hidden');
            winnerMessage.textContent = '';
            newRoundBtn.disabled = false; // Enable button for new game
            renderScoreTable(); // Clear table
        });
    });

    // Special modal for confirmation
    function showModal(title, message, confirmCallback = null) {
        modalTitle.textContent = title;
        modalContent.innerHTML = message; // Use innerHTML for potential line breaks or richer content
        overlay.classList.remove('hidden');
        modal.classList.remove('hidden');

        // Remove any previous confirm button
        let existingConfirmBtn = document.getElementById('modal-confirm-btn');
        if (existingConfirmBtn) {
            existingConfirmBtn.remove();
        }

        if (confirmCallback) {
            modalContent.insertAdjacentHTML('afterend', '<button id="modal-confirm-btn" class="danger-btn" style="margin-right: 10px;">Confirm</button>');
            document.getElementById('modal-confirm-btn').addEventListener('click', () => {
                confirmCallback();
                hideModal();
            });
            modalCloseBtn.textContent = 'Cancel';
        } else {
            modalCloseBtn.textContent = 'Close';
        }
    }


    restartGameBtn.addEventListener('click', () => {
        showModal('Confirm Restart Game', 'Are you sure you want to restart the game? All current scores will be lost.', () => {
            players = [];
            gameStarted = false;
            currentRound = 0;
            gameStartTime = null;
            roundStartTimes = [];
            clearInterval(gameInterval);
            gameDurationDisplay.textContent = '00:00:00';
            currentRoundDisplay.textContent = '0';

            playerInputContainer.innerHTML = '';
            playerInputContainer.appendChild(createPlayerInput(1));
            playerInputContainer.appendChild(createPlayerInput(2));
            playerCount = 2; // Reset player counter

            gameDashboardSection.classList.add('hidden');
            playerSetupSection.classList.remove('hidden');
            gameOverMessage.classList.add('hidden');
            winnerMessage.textContent = '';
            newRoundBtn.disabled = false; // Enable button for new game
            renderScoreTable(); // Clear table
        });
    });

});