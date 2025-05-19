import Rappers from './rappers.js';

// Pick random rapper
const todaysRapper = Rappers[Math.floor(Math.random() * Rappers.length)]

// Remember rappers that were already chosen
const alreadyChosen = [];

// Add resize button
handleResizeButton();

//Autocomplete names
const input = document.querySelector('input');
const suggestionsDiv = document.querySelector('#suggestions');

function populateDiv(rappers) {
    suggestionsDiv.textContent = null;
    rappers.forEach(rapper => {
        let suggestion = document.createElement('p');
        suggestion.classList.add('suggestion');
        suggestion.value = rapper;
        suggestion.textContent = rapper.name;
        suggestionsDiv.appendChild(suggestion);
        suggestion.addEventListener('click', () => guess(rapper));
    })
}

function autocomplete(e) {
    e.stopPropagation();
    let name = this.value;
    let suggestions = [];
    suggestionsDiv.style.display = 'block'

    if (name.length > 0) {
        Rappers.forEach(rapper => {
            if (rapper.name.toUpperCase().startsWith(name.toUpperCase())) {
                if (!alreadyChosen.includes(rapper))
                suggestions.push(rapper);
            }
        })
        populateDiv(suggestions)
    }

    if (suggestions.length === 0 && name.length > 0) {
        const notFound = document.createElement('p');
        notFound.textContent = 'Rapper not found';
        notFound.classList.add('notFound');
        suggestionsDiv.appendChild(notFound);

    } else if (suggestions.length === 0) {
        suggestionsDiv.textContent = null;
    }
}

input.addEventListener('keyup', autocomplete);
input.addEventListener('click', autocomplete);


// When user clicks outside of suggestions box to check what was shown to him
function hideSuggestions() {
    suggestionsDiv.style.display = 'none';
}

document.addEventListener('click', hideSuggestions);


// --- Keyboard UX improvements ---

// When user presses enter choose the first rapper that is being shown
input.addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
        if (document.querySelector('.suggestion')) {
            guess(document.querySelector('.suggestion').value);
        }
    }
})

// Highlight first rapper
input.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        if (document.querySelector('.suggestion')) {
            document.querySelector('.suggestion').classList.add('chosen');
        }
    }
})


// Check if guessed rapper is the todays choice
const tableBody = document.querySelector('tbody');

async function guess(rapper) {
    // Empty the input box and hide suggestions div
    suggestionsDiv.textContent = null;
    input.value = null;
    // Disable input while the guess is being shown
    input.disabled = true;

    // Create new tr for current guess
    const newGuessRow = document.createElement('tr');
    tableBody.insertBefore(newGuessRow, tableBody.querySelector('.guess') || null);
    newGuessRow.classList.add('guess');
    
    const attributes = ['name', 'age', 'genre', 'from', 'debut', 'monthly']

    for (const attribute of attributes) {
        const tableData = document.createElement('td');
        newGuessRow.appendChild(tableData);

        if (attribute != "genre") {
            tableData.textContent = rapper[attribute];
        }


        if (attribute === "name") {
            tableData.classList.add('name');
        } 
        
        if (attribute === "genre") {
            tableData.textContent = populateGenres(rapper[attribute]);

            tableData.classList.add(compareGenre(rapper));
        }

        if (attribute === "monthly") {
            const valueTodayRapper = parseInt(todaysRapper.monthly.slice(0, -2));
            const valueChosenRapper = parseInt(rapper.monthly.slice(0, -2));

            if (valueTodayRapper < valueChosenRapper) {
                tableData.textContent += " \u2193";
                tableData.classList.add('wrong');
            } else if (valueTodayRapper > valueChosenRapper) {
                tableData.textContent += " \u2191";
                tableData.classList.add('wrong');
            } else {
                tableData.classList.add('correct');
            }
        }

        if (attribute === "age" || attribute === "debut") {

            if (todaysRapper[attribute] < rapper[attribute]) {
                tableData.textContent += " \u2193";
                tableData.classList.add('wrong');
            } else if (todaysRapper[attribute] > rapper[attribute]) {
                tableData.textContent += " \u2191";
                tableData.classList.add('wrong');
            } else {
                tableData.classList.add('correct');
            }
        }

        if (attribute === "from") {
            if (todaysRapper.from === rapper.from) {
                tableData.classList.add('correct');
            } else {
                tableData.classList.add('wrong');
            }
        }

        await waitForAnimationEnd(tableData);
    }

    if (rapper === todaysRapper) {
        triggerAnimation(logo, "correctGuess");
        input.classList.add('animate-hideInput');
        winnerModal();
    } else {
        //triggerAnimation(logo, "wrongGuess");
        alreadyChosen.push(rapper);
        input.disabled = false;
        input.focus();
    }
}

function compareGenre(rapper) {
    const sortedA = todaysRapper.genre.sort();
    const sortedB = rapper.genre.sort();

    if (sortedA.every((val, index) => val === sortedB[index]) 
        && sortedA.length === sortedB.length) {
        return 'correct';
    } else if (sortedA.some(genre => sortedB.includes(genre))) {
        return 'close';
    } else {
        return 'wrong';
    }
}

function populateGenres(array) {
    let tableContent = '';

    for (let i = 0; i < array.length; i++) {
        tableContent += `${array[i]}`
        if (i != array.length - 1) {
            tableContent += ', '
        }
    }

    return tableContent
}

async function waitForAnimationEnd(element) {
    return new Promise(resolve => {
        element.addEventListener('animationend', resolve, {once: true});
    })
}


// Animate logo on correct        and wrong guess
const logo = document.querySelector('#logo')

function triggerAnimation(element, animationName) {
    element.classList.add(`animate-${animationName}`);

    element.addEventListener('animationend', () => {
        element.classList.remove(`animate-${animationName}`);
    })
}


function winnerModal() {
    const modalDiv = document.createElement('div');
    document.body.appendChild(modalDiv);
    modalDiv.classList.add('modalDiv')

    const modal = document.createElement('div');
    modalDiv.appendChild(modal);
    modal.classList.add('modal');
    modal.textContent = `It's ${todaysRapper.name}!`;

    const attemptCount = document.createElement('p');
    attemptCount.textContent = howManyAttempts(alreadyChosen.length + 1);
    attemptCount.style.fontSize = '30px';
    modal.appendChild(attemptCount);

    const okButton = document.createElement('button');
    modal.appendChild(okButton);
    okButton.textContent = 'close';
    okButton.classList.add('okButton')

    okButton.addEventListener('click', () => {
        modalDiv.remove();
        modal.remove();
        okButton.remove();
    })
}

function howManyAttempts(count) {
    if (count > 1) {
        return `It took you ${count} attempts`;
    } else if (count === 1) {
        return 'First try!';
    }
}

// Add and remove resize button depending on how big is the window
function handleResizeButton() {
    if (window.innerWidth <= 600 && !document.querySelector('.resize')) {
        const resizeButton = document.createElement('button');
        resizeButton.classList.add('resize');
        document.body.appendChild(resizeButton);
        resizeButton.textContent = 'Show full table'
        resizeButton.addEventListener('click', resizeTable);
    } else if (window.innerWidth > 600 && document.querySelector('.resize')) {
        document.querySelector('.resize').remove();
    }
}

window.addEventListener('resize', handleResizeButton);


// Change the appearance of table
function resizeTable() {
    const table = document.querySelector('table');
    table.classList.toggle('fixedTable');
}