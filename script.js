const saldo = document.getElementById('saldo')
const money_plus = document.getElementById('suma-euros')
const money_minus = document.getElementById('resta-euros')
const list = document.getElementById('list')
const form = document.getElementById('form')
const text = document.getElementById('text')
const cantidad = document.getElementById('cantidad')

const localStorageTransactions = JSON.parse(
    localStorage.getItem('transactions')
);

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// Operación
function addTransaction(e) {
    e.preventDefault();

    if(text.value.trim() === '' || cantidad.value.trim() === '') {
        alert('Por favor ingresa una descripción y una cantidad');
    }else {
        const transaction = {
            id: generateID(),
            text: text.value,
            cantidad: +cantidad.value
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues()

        updateLocalStorage()

        text.value = ''
        cantidad.value = ''
    }
}

//genera ID 
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

//DOM
function addTransactionDOM(transaction) {
    //sign
    const sign = transaction.cantidad < 0 ? '-' : '+';

    const item = document.createElement('li');

    // clase
    item.classList.add(transaction.cantidad < 0 ? 'minus' : 'plus');

    item.innerHTML = `
    
        ${transaction.text} <span>${sign}${Math.abs(transaction.cantidad)}</span>
        <button class="delete-boton" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

//actualiza
function updateValues() {
    const cantidades = transactions.map(transaction => transaction.cantidad);

    const total = cantidades.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = cantidades
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        cantidades.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    saldo.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}

//borra por nombre
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();

    init();
}

//actualiza localst
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

//Init app
function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionDOM);
    updateValues()
}

init();
form.addEventListener('submit', addTransaction);