/* -------------------------------- ELEMENTS -------------------------------- */

elemKeyboard = document.querySelector('.keyboard');
elemDisplayInput = document.querySelector('.display__input');
elemDisplayOperation = document.querySelector('.display__operation');

/* -------------------------------- VARIABLES ------------------------------- */

let currentOperation = [];
let currentInput = '0';
let lastResult = null;

/* -------------------------------- FUNCTIONS ------------------------------- */

const operation = operationArray => {
    const operator = operationArray[1];
    const numbers = [operationArray[0], operationArray[2]];
    let result;
    switch (operator) {
        case '+':
            result = add(numbers[0], numbers[1]);
            break;
        case '-':
            result = subtract(numbers[0], numbers[1]);
            break;
        case '×':
            result = multiply(numbers[0], numbers[1]);
            break;
        case '÷':
            result = divide(numbers[0], numbers[1]);
    }
    return Math.round(result * 1000) / 1000;
}

/* ------------------------------- OPERATIONS ------------------------------- */

const add = (a, b) => {
    return +a + +b;
}

const subtract = (a, b) => {
    return +a - +b;
}

const multiply = (a, b) => {
    return +a * +b;
}

const divide = (a, b) => {
    return +a / +b;
}

/* -------------------------------- HANDLERS -------------------------------- */

const handleClick = event => {
    elemClicked = event.target;
    currentKey = elemClicked.textContent;

    if (elemClicked.className.includes('keyboard')) return;

    if (elemClicked.className.includes('key--operation')) {

        // operation key
        if (lastResult == null) {
            if (currentInput == null) currentInput = '0';
            lastResult = currentInput;
        }
        if (currentInput?.slice(-1) === '.') currentInput = currentInput.slice(0, -1);

        if (currentOperation.includes('=')) {
            if (currentKey === '=') {
                if (currentInput == null) {
                    if (currentOperation.length > 2) {
                        currentOperation = [lastResult]
                    } else return;
                } else currentOperation = [currentInput];
            } else {
                if (currentInput == null) {
                    currentOperation = [lastResult];
                } else currentOperation = [currentInput];
            }
        } else if (currentInput == null) {
            if (currentOperation.includes(currentKey)) return;
            currentOperation = [lastResult];
        } else currentOperation.push(currentInput);

        if (currentOperation.length > 2) {
            const result = operation(currentOperation);
            elemDisplayInput.textContent = result;

            if (currentKey === '=' && (!(currentOperation.includes('=')))) {
                currentOperation.push(currentKey);
            } else currentOperation = [result, currentKey];

            lastResult = result;

        } else currentOperation.push(currentKey);

        currentInput = null;
        elemDisplayOperation.textContent = currentOperation.join(' ');
    } else if (elemClicked.className.includes('key--general')) {

        // general key
        currentOperation = [];
        elemDisplayOperation.textContent = '';

        switch (true) {
            case elemClicked.className.includes('key--clear'):
                currentInput = null;
                lastResult = null;
                elemDisplayInput.textContent = '0';
                break;
            case elemClicked.className.includes('key--plusminus'):
                if (currentInput == null) {
                    if (lastResult == null) return;
                    currentInput = `${+lastResult * -1}`
                } else currentInput = `${+currentInput * -1}`;
                elemDisplayInput.textContent = currentInput;
                break;
            case elemClicked.className.includes('key--percent'):
                if (currentInput == null) {
                    if (lastResult == null) return;
                    currentInput = `${(Math.round(lastResult * 10) / 1000)}`;
                } else currentInput = `${(Math.round(currentInput * 10) / 1000)}`;
                elemDisplayInput.textContent = currentInput;
        }
    } else if (elemClicked.className.includes('key--number')) {

        // number key
        if (currentInput == null) {
            if (currentOperation.includes('=')) {
                currentOperation = [];
                elemDisplayOperation.textContent = '';
            }
            currentInput = '0';
        }

        if (elemClicked.className.includes('key--dot')) {
            if (!currentInput.includes('.')) {
                currentInput += currentKey;
            }
        } else {
            currentInput = currentInput === '0' ? currentKey : currentInput + currentKey;
        }

        elemDisplayInput.textContent = currentInput;
    }
}

const handleSelect = event => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(event.target);
    selection.removeAllRanges();
    selection.addRange(range);
}


/* --------------------------------- EVENTS --------------------------------- */

elemKeyboard.addEventListener('click', handleClick);
elemDisplayInput.addEventListener('click', handleSelect);
elemDisplayOperation.addEventListener('click', handleSelect);

/* ---------------------------------- INIT ---------------------------------- */

elemDisplayInput.textContent = currentInput;