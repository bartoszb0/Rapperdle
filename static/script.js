import Rappers from './rappers.js';

// Pick random rapper
const todaysRapper = Rappers[Math.floor(Math.random() * Rappers.length)]
console.log(todaysRapper)
console.log(todaysRapper.genre)

// Remember rappers that were already chosen
const alreadyChosen = [];

// TODO make it so that every square with infomration is being shown one at a time


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
function chooseFirstRapper(e) {
    if (e.key === "Enter") {
        if (document.querySelectorAll('.suggestion')[0]) {
            guess(document.querySelectorAll('.suggestion')[0].value)
        }
    }
}

input.addEventListener('keyup', chooseFirstRapper);


// Check if guessed rapper is the todays choice
const tableBody = document.querySelector('tbody');

function guess(rapper) {
    // Empty the input box and hide suggestions div
    suggestionsDiv.textContent = null;
    input.value = null;
    // Focus on input again
    input.focus()

    // Create new tr for current guess
    const newGuessRow = document.createElement('tr');
    tableBody.insertBefore(newGuessRow, tableBody.querySelector('.guess') || null);
    newGuessRow.classList.add('guess');
    
    const attributes = ['name', 'age', 'genre', 'from', 'debut', 'monthly']

    attributes.forEach(attribute => {
        const tableData = document.createElement('td');
        newGuessRow.appendChild(tableData);

        tableData.textContent = rapper[attribute];

        if (attribute === "name") {
            tableData.classList.add('name');
        } 
        
        if (attribute === "genre") {
            if (todaysRapper.genre === rapper.genre) {
                tableData.classList.add('correct');
            } else if (todaysRapper.genre.includes(rapper.genre) || rapper.genre.includes(todaysRapper.genre)) {
                tableData.classList.add('close');
            } else {
                tableData.classList.add('wrong');
            }
        }

        if (attribute === "age" || attribute === "debut" || attribute === "monthly") {

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
    })

    if (rapper === todaysRapper) {
        triggerAnimation(logo, "correctGuess");
        input.style.visibility = 'hidden';
    } else {
        triggerAnimation(logo, "wrongGuess");
        alreadyChosen.push(rapper);
    }
}


// Animate logo on correct and wrong guess
const logo = document.querySelector('#logo')

function triggerAnimation(element, animationName) {
    element.classList.add(`animate-${animationName}`);

    element.addEventListener('animationend', () => {
        element.classList.remove(`animate-${animationName}`);
    })
}