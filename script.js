let input;
let inputText = '';
let inputCost = '';
let expenseList = JSON.parse(localStorage.getItem('list')) || [];
let beingEdited = false;
let editBtn;
let editID = null;
let total;

// add async
window.onload = () => {
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

    // const response = await (await fetch('http://localhost:4000/expense', {
    //     method: 'GET'
    // })).json();
    // expenseList = response;

    render();
}

updateValueT = (e) => {
    inputText = e.target.value;
}
updateValueC = (e) => {
    inputCost = e.target.value;
}

// add async
addExpense = () => {
    if (inputText.trim() && inputCost > 0 && !beingEdited) {
        // const resp = await fetch('http://localhost:4000/expense', {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/json;charset=utf-8',
        //         'Access-Control-Allow-Origin': '*'
        //     },
        //     body: JSON.stringify({
        //         text: inputText,
        //         cost: inputCost
        //     })
        // });
        // let result = await resp.json();
        // expenseList.push(result);

        expenseList.push({
            text: inputText,
            cost: inputCost
        })
        inputText = '';
        inputT.value = '';
        inputCost = '';
        inputN.value = '';
        inputT.focus();
        // localStorage.setItem('list',JSON.stringify(expenseList));
        console.log(`expenseList`, expenseList);
        render();
    } else if (inputText.trim() && inputCost > 0 && beingEdited) {
        // const response = await fetch(`http://localhost:4000/expense/${editID}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json;charset=utf-8',
        //         'Access-Control-Allow-Origin': '*'
        //     },
        //     body: JSON.stringify({
        //         text: inputText,
        //     })
        // });
        // let result = await response.json();

        // expenseList = expenseList.map(expense => {
        //     if (editID == expense._id) return { ...expense, text: inputT.value, cost: inputN.value  };
        //     return expense;
        // });

        expenseList = expenseList.map((expense,index) => {
            if (editID == index) return { ...expense, text: inputT.value, cost: inputN.value };
            return expense;
        });
        inputText = '';
        inputT.value = '';
        inputCost = '';
        inputN.value = '';
        editID = null;
        beingEdited = false;

        inputT.focus();
        // localStorage.setItem('list',JSON.stringify(expenseList));
        render();
    } else if (!inputCost) alert("Пожалуйста, введите сумму расхода");
     else if (inputCost <= 0) alert("Сумма не может быть меньше нуля ");
     else alert('Пожалуйста, введите текст');
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
        sum.innerText = `итого: ${total} р.`;
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
            editBtn.onclick = () => editExpense(index);

            // delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'удалить';
            deleteBtn.className = 'delete-btn';
            btnContainer.appendChild(deleteBtn);
            deleteBtn.onclick = () => removeExpense(index);

            // appending expense to container
            expenseContainer.appendChild(expense);
        });

        // clear all items button
        // if (expenseList.length) {
        //     const clearAllBtn = document.createElement('button');
        //     clearAllBtn.innerText = 'clear all';
        //     clearAllBtn.type = 'button';
        //     clearAllBtn.className = 'clearAll-btn';
        //     clearAllBtn.onclick = () => clearAllExpenses();
        //     expenseContainer.appendChild(clearAllBtn);
        // }
    }

}

// onChangeCheckbox = async (id) => {
//     expenseList[id].cost = !expenseList[id].cost;
//     // localStorage.setItem('list',JSON.stringify(expenseList));

//     const response = await fetch(`http://localhost:4000/expense/${expenseList[id]._id}`, {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json;charset=utf-8',
//             'Access-Control-Allow-Origin': '*'
//         },
//         body: JSON.stringify({
//             cost: expenseList[id].cost,
//         })
//     });
//     let result = await response.json();
//     render();
// }
totalCost = () => {
    return expenseList.reduce((res, obj) => res += Number(obj.cost),0);
}

editExpense = (id) => {
    // const specificItem = expenseList.find(expense => id === expense._id);
    const specificItem = expenseList.find((expense, index) => id === index);
    inputT.value = specificItem.text;
    inputText = specificItem.text;
    inputN.value = specificItem.cost;
    inputCost = specificItem.cost;
    editID = id;
    beingEdited = true;
    inputT.focus();
}
removeExpense = (id) => { // add async
    // const response = await fetch(`http://localhost:4000/expense/${id}`, {
    //     method: 'DELETE'
    // });
    // let result = await response.json();
    // expenseList = expenseList.filter(item => id !== item._id);
    expenseList = expenseList.filter((item, index) => id !== index);
    // localStorage.setItem('list',JSON.stringify(expenseList));
    render();
}
// clearAllExpenses = () => {
//     // const response = await fetch(`http://localhost:4000/expense`, {
//     //     method: 'DELETE'
//     // });
//     expenseList = [];
//     // localStorage.setItem('list',JSON.stringify(expenseList));
//     render();
// }
