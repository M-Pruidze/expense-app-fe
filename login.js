let firstNameE;
let lastNameE;
let inputFirstName = '';
let inputLastName = '';
let email;
let password;
let inputEmail = '';
let inputPassword = '';
let id;
let userId;
let token;
let firstName;
let lastName;


window.onload = async () => {
    firstNameE = document.getElementById('firstName');
    lastNameE = document.getElementById('lastName');
    email = document.getElementById('email');
    password = document.getElementById('password');
    const signup = document.getElementById("signup");
    if (firstNameE && lastNameE) {
        firstNameE.addEventListener('change',updateFirstName);
        lastNameE.addEventListener('change',updateLastName);
        firstNameE.addEventListener('keyup', (event) => {
            if (event.code === 'Enter') {
                event.preventDefault;
                lastName.focus();
            }
        });
        lastNameE.addEventListener('keyup', (event) => {
            if (event.code === 'Enter') {
                event.preventDefault;
                email.focus();
            }
        });
    };
    email.addEventListener('change',updateEmail);
    password.addEventListener('change',updatePassword);
    email.addEventListener('keyup', (event) => {
        if (event.code === 'Enter') {
            event.preventDefault;
            password.focus();
        }
    });
    password.addEventListener('keyup', (event) => {
        if (event.code === 'Enter') {
            event.preventDefault;
            // signUp();
        }
    });
}

updateFirstName = (e) => {
    inputFirstName = e.target.value;
}
updateLastName = (e) => {
    inputLastName = e.target.value;
}
updateEmail = (e) => {
    inputEmail = e.target.value;
}
updatePassword = (e) => {
    inputPassword = e.target.value;
}
signUp = async () => {
        try {
            const resp = await fetch('http://localhost:4000/auth', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    firstName: inputFirstName,
                    lastName: inputLastName,
                    email: inputEmail,
                    password: inputPassword
                })
            });
            const result = await resp.json();

            // logging the error to console
            if (resp.status !== 200) console.log(result);

            inputFirstName = '';
            firstNameE.value = '';
            inputLastName = '';
            lastNameE.value = '';
            inputEmail = '';
            email.value = '';
            inputPassword = '';
            password.value = '';

            if (resp.status === 200) window.location.href = 'login.html';

        } catch (error) {
            console.log(`error signup`, error)
        }
}


login = async () => {
        try {
            const resp = await fetch('http://localhost:4000/auth/login', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    email: inputEmail,
                    password: inputPassword,
                })
            });
            const result = await resp.json();
            token = result.token;

            // logging the error to console
            if (resp.status !== 200) console.log(result.info.message);

            userId = result.user._id;
            firstName = result.user.firstName;
            lastName = result.user.lastName;
            console.log(`rsult`, result)

            localStorage.setItem('access_token',JSON.stringify(token));
            localStorage.setItem('userId',JSON.stringify(userId));
            localStorage.setItem('firstName',JSON.stringify(firstName));
            localStorage.setItem('lastName',JSON.stringify(lastName));

            inputEmail = '';
            email.value = '';
            inputPassword = '';

            window.location.href = 'expense.html';
        } catch (error) {
            console.log(`error login`, error)
        }
}

