## Setup & Installation

This is a static web application, so setting it up is very straightforward.

live - [Live Demo](https://amolkamble4161.github.io/RummyRecord/)

1.  **Clone the repository (or download files):**

    If you have Git installed:
    ```bash
    git clone <repository-url>
    cd rummy-record
    ```
    (Replace `<repository-url>` with the actual URL if this project were hosted on GitHub)

    Alternatively, you can manually download the `index.html`, `style.css`, and `script.js` files into a single folder.

2.  **Open `index.html`:**
    Simply open the `index.html` file in your preferred web browser (Chrome, Firefox, Edge, Safari, etc.). No web server is required for local use.

## How to Use

1.  **Add Players:**
    -   On the initial screen, enter the names of your players in the input fields.
    -   Click the **"Add Another Player"** button to add more players. (Minimum 2 players required).
    -   You can remove players using the "X" button next to their name.

2.  **Start Game:**
    -   Once all players are added, click the **"Start Game"** button.
    -   The game dashboard will appear, and the game duration timer will begin.

3.  **Record Scores:**
    -   A new round (Round 1) will automatically be added to the table.
    -   In the input fields for the current round:
        -   Enter the **points** each player scored.
        -   Enter `W` or `0` for the **winner** of the round (their score will be recorded as 0).
        -   Enter `D` or `d` for a player who **dropped** in that round (their score will be recorded as 25).
    -   **Important:** Only one player can be the winner per round.

4.  **Add New Rounds:**
    -   After entering all scores for a round, click **"Add New Round"** to proceed to the next round.
    -   The table will update with new input fields for the next round.

5.  **Monitor Player Status:**
    -   Players whose total score reaches or exceeds **200 points** will have their name and total score highlighted as **"Danger Zone"**.
    -   Players whose total score reaches or exceeds **250 points** will be marked as **"OUT"** and can no longer receive points. Their input fields will be disabled.

6.  **Game End:**
    -   The game automatically ends when only one player remains active (i.e., all other players are "OUT").
    -   The **"Game Over!"** message will display the winner (the active player, or the player with the lowest score if everyone is out).

7.  **Game Controls:**
    -   **"Add New Round":** Adds a new row for score entry.
    -   **"Clear All Data":** Clears all scores and player data, returning to the initial player setup screen. Requires confirmation.
    -   **"New Game / Restart":** Clears the current game data and restarts the game from the player setup screen. Requires confirmation.

8.  **Theme Toggle:**
    -   Click the **moon/sun icon** in the top right corner to switch between dark and light themes. The preference is saved in your browser's local storage.

9.  **Hamburger Menu:**
    -   Click the **menu icon** in the top left to access the sidebar with "About," "How to Use," "Privacy Policy," and "Contact" information.

## Game Logic & Rules

-   **Dropped Player:** Entering 'D' or 'd' assigns 25 points for that round.
-   **Winner:** Entering 'W', 'w', or '0' assigns 0 points for that round. Only one winner per round is allowed.
-   **Danger Zone:** Total score ≥ 200 points.
-   **Player Out:** Total score ≥ 250 points. Once a player is out, they cannot score further points.
-   **Game Winner:** The last remaining player who is not "OUT," or the player with the lowest total score if all players go "OUT."

## Technologies Used

-   **HTML5:** For the basic structure of the web application.
-   **CSS3:** For styling, responsive design, and theme management.
-   **JavaScript (ES6+):** For all interactive functionalities and game logic.
-   **Font Awesome:** For icons (e.g., hamburger, theme toggle, player add/remove).

## Contributing

This project is a simple scorekeeping tool. If you have suggestions for improvements or find any bugs, feel free to open an issue or submit a pull request!

## License

This project is open-source and available under the [MIT License](LICENSE).