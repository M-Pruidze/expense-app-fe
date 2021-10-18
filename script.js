// require('dotenv').config();

let inputT;
let inputN;
let inputText = '';
let inputCost = '';
let expenseList = [];
let beingEdited = false;
let editBtn;
let editID = null;
let total;
const userId = JSON.parse(localStorage.getItem('userId'));
const jwt = JSON.parse(localStorage.getItem('access_token'));
const firstName = JSON.parse(localStorage.getItem('firstName'));
const lastName = JSON.parse(localStorage.getItem('lastName'));
// let fullName;

const checkUser = async () => {
    try {
        const response = await fetch('http://localhost:4000/user/${userId}/profile', {
                method: "GET",
                headers: {Authorization: `Bearer ${jwt}`}
            });
        if (response.status === 401) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.log(`error login`, error)
    }
};



window.onload = async () => {
    checkUser();
    fullName = document.querySelector('.fullName');
    fullName.innerText = `${firstName} ${lastName}`;
    fullName.title = `${firstName} ${lastName}`;
    inputT = document.getElementById('inputText');
    inputN = document.getElementById('inputCost');
    const addBtn = document.getElementById("add-btn");
    inputT.addEventListener('change', updateValueT);
    inputN.addEventListener('change', updateValueC);
    inputT.addEventListener('keyup', (event) => {
        if (event.code === 'Enter') {
            event.preventDefault;
            inputN.focus();
        }
    });
    inputN.addEventListener('keyup', (event) => {
        if (event.code === 'Enter') {
            event.preventDefault;
            addBtn.click();
        }
    });
    addBtn.addEventListener("click", addExpense);

    const response = await (await fetch('http://localhost:4000/expense', {
        method: 'GET',
        headers: {Authorization: `Bearer ${jwt}`}
    })).json();

    // fullName.innerText = `${response[0].firstName} ${response[0].lastName}`;

    expenseList = response;
    render();
    // console.log(`process.env.AGE`, process.env.AGE)
}
logout = () => {
    window.localStorage.removeItem('userId');
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('firstName');
    window.localStorage.removeItem('lastName');
    window.location.href = 'login.html';
}
updateValueT = (e) => {
    inputText = e.target.value;
}
updateValueC = (e) => {
    inputCost = e.target.value;
}

addExpense = async () => {
    if (inputText.trim() && inputCost > 0 && !beingEdited) {
        const resp = await fetch('http://localhost:4000/expense', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
                text: inputText,
                cost: inputCost,
                userId,
                firstName,
                lastName,
            })
        });
        let result = await resp.json();
        expenseList.push(result);

        inputText = '';
        inputT.value = '';
        inputCost = '';
        inputN.value = '';
        inputT.style.border = 'none';
        inputN.style.border = 'none';
        inputT.focus();
        render();
    } else if (inputText.trim() && inputCost > 0 && beingEdited) {
        const response = await fetch(`http://localhost:4000/expense/${editID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify({
                text: inputText,
                cost: inputCost
            })
        });
        expenseList = expenseList.map(expense => {
            if (editID == expense._id) return { ...expense, text: inputT.value, cost: inputN.value  };
            return expense;
        });
        inputText = '';
        inputT.value = '';
        inputCost = '';
        inputN.value = '';
        editID = null;
        beingEdited = false;
        inputT.focus();
        render();
    } else if (!inputText.trim()) {
        inputT.style.border = '2px solid red';
        inputT.focus();
    }
    else if (!inputCost || inputCost <= 0) inputN.style.border = '2px solid red';

}
render = () => {
    const expenseContainer = document.querySelector('.content');
    while (expenseContainer.firstChild) {
        expenseContainer.firstChild.remove();
    }
    if (expenseList.length) {
        // sum
        const sum = document.createElement('p');
        total = totalCost();
        sum.innerText = `Итого: ${total} р.`;
        sum.className = 'sum';
        expenseContainer.appendChild(sum);

        expenseList.map((singleExpense, index) => {
            const expense = document.createElement('article');
            expense.className = 'expense-container';

            // single expense's text
            const expenseText = document.createElement('p');
            expenseText.innerText = `${index+1}) ${singleExpense.text}`;
            expenseText.className = 'expense-text';
            expense.appendChild(expenseText);

            // single expense's cost
            const expenseNumber = document.createElement('p');
            expenseNumber.innerText = `${singleExpense.cost} р.`;
            expenseNumber.className = 'expense-cost';
            expense.appendChild(expenseNumber);

            // buttons' container
            const btnContainer = document.createElement('div');
            btnContainer.className = 'btn-container';
            expense.appendChild(btnContainer);

            // edit button
            editBtn = document.createElement('button');
            editBtn.innerText = 'редактировать';
            editBtn.className = 'edit-btn';
            btnContainer.appendChild(editBtn);
            editBtn.onclick = () => editExpense(singleExpense._id);

            // delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'удалить';
            deleteBtn.className = 'delete-btn';
            btnContainer.appendChild(deleteBtn);
            deleteBtn.onclick = () => removeExpense(singleExpense._id);

            // appending expense to container
            expenseContainer.appendChild(expense);
        });
    }
}
totalCost = () => {
    return expenseList.reduce((res, obj) => res += Number(obj.cost),0);
}

editExpense = (id) => {
    const specificItem = expenseList.find(expense => id === expense._id);
    inputT.value = specificItem.text;
    inputText = specificItem.text;
    inputN.value = specificItem.cost;
    inputCost = specificItem.cost;
    editID = id;
    beingEdited = true;
    inputT.focus();
}
removeExpense = async (id) => {
    const response = await fetch(`http://localhost:4000/expense/${id}`, {
        method: 'DELETE',
        headers: {Authorization: `Bearer ${jwt}`},
    });
    expenseList = expenseList.filter(item => id !== item._id);
    render();
}
