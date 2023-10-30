/* -------------------------------- ELEMENTS -------------------------------- */

elemKeyboard = document.querySelector('.keyboard');
elemDisplay = document.querySelector('.display');
elemDisplayInput = document.querySelector('.display__input');
elemDisplayOperation = document.querySelector('.display__operation');
elemCalc = document.querySelector('.calc');
elemFooter = document.querySelector('.footer');
elemsKeys = document.querySelectorAll('.key');

elemKeyMultiply = document.querySelector('.key--multiply');
elemKeyDivide = document.querySelector('.key--divide');
elemKeyPlusMinus = document.querySelector('.key--plusminus');
elemKeyEquals = document.querySelector('.key--equals');
elemKeyClear = document.querySelector('.key--clear');
elemKeyDot = document.querySelector('.key--dot');

/* -------------------------------- CONSTANTS ------------------------------- */

const specialKeys = {
    '*': elemKeyMultiply,
    '/': elemKeyDivide,
    'Tab': elemKeyPlusMinus,
    'Enter': elemKeyEquals,
    'Delete': elemKeyClear,
    ',': elemKeyDot
};

/* -------------------------------- VARIABLES ------------------------------- */

let currentOperation = [];
let currentInput = '0';
let result;
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
            if (numbers[1] == 0) return 'Error';
            result = divide(numbers[0], numbers[1]);
    }
    return Math.round(result * 10000) / 10000;
};

/* ------------------------------- OPERATIONS ------------------------------- */

const add = (a, b) => +a + +b;

const subtract = (a, b) => +a - +b;

const multiply = (a, b) => +a * +b;

const divide = (a, b) => +a / +b;

/* -------------------------------- HANDLERS -------------------------------- */

const handleClick = elemClicked => {
    currentKey = elemClicked.textContent;

    if (elemClicked.className.includes('keyboard')) return;

    if (elemClicked.className.includes('key--operation')) {

        // operation key pressed
        if (currentInput?.slice(-1) === '.') currentInput = currentInput.slice(0, -1);
        if (lastResult == null) {
            if (currentInput == null) currentInput = '0';
            lastResult = currentInput;
        }

        // if some operator key has just been pressed before
        if (currentInput == null) {
            if (currentKey === '=') {
                if (currentOperation.length > 2) {
                    currentOperation = [lastResult, ...currentOperation.slice(1, -1)];
                } else if (!(currentOperation.includes('='))) {
                    currentOperation.push(currentOperation[0]);
                } else currentOperation = [currentOperation[0]];
            } else if (currentOperation.length <= 2) currentOperation = [currentOperation[0]];
        } else currentOperation.push(currentInput);

        // if there is a complete operation in the array
        if (currentOperation.length > 2) {
            result = operation(currentOperation);
            elemDisplayInput.textContent = result;
            if (result === 'Error') result = 0;

            if (currentKey === '=' && (!(currentOperation.includes('=')))) {
                currentOperation.push(currentKey);
            } else currentOperation = [result, currentKey];

            lastResult = result;
        } else currentOperation.push(currentKey);
        currentInput = null;
        elemDisplayOperation.textContent = currentOperation.join(' ');

    } else if (elemClicked.className.includes('key--general')) {

        // general key pressed
        currentOperation = [];
        elemDisplayOperation.textContent = '';

        switch (true) {
            case elemClicked.className.includes('key--clear'):
                currentInput = null;
                lastResult = null;
                elemDisplayInput.textContent = '0';
                currentOperation = [];
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

        // number key pressed
        if (currentInput == null) {
            if (currentOperation.includes('=')) {
                currentOperation = [];
                elemDisplayOperation.textContent = '';
            }
            currentInput = '0';
        }
        if (elemClicked.className.includes('key--dot')) {
            if (!currentInput.includes('.')) currentInput += currentKey;
        } else {
            currentInput = currentInput === '0' ? currentKey : currentInput + currentKey;
        }
        elemDisplayInput.textContent = currentInput;
    }
};

const handleSelect = event => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(event.target);
    selection.removeAllRanges();
    selection.addRange(range);
};

const handleDeselect = event => {
    const elem = event.target;
    if (elem.nodeName === 'P' && elem.className.includes('display')) return;
    window.getSelection().removeAllRanges();
};

const handleKeyPress = event => {
    for (const entry of Object.entries(specialKeys)) {
        if (entry[0] === event.key) {
            event.preventDefault();
            handleClick(entry[1]);
            return;
        }
    }

    elemsKeys.forEach(key => {
        if (key.textContent === event.key) handleClick(key);
    })
};

/* --------------------------------- EVENTS --------------------------------- */

elemKeyboard.addEventListener('click', event => handleClick(event.target));
elemDisplayInput.addEventListener('click', handleSelect);
elemDisplayOperation.addEventListener('click', handleSelect);
elemDisplay.addEventListener('click', handleDeselect);
elemCalc.addEventListener('click', handleDeselect);
elemFooter.addEventListener('click', handleDeselect);
document.addEventListener('keydown', handleKeyPress);

/* ---------------------------------- INIT ---------------------------------- */

elemDisplayInput.textContent = currentInput;