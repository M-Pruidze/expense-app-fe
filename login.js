let email;
let password;
let inputEmail = '';
let inputPassword = '';
let id;
let userId;
let token;

window.onload = async () => {
    email = document.getElementById('email');
    password = document.getElementById('password');
    const signup = document.getElementById("signup");
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
    // signup.addEventListener("click", signUp);

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
                    email: inputEmail,
                    password: inputPassword
                })
            });
            const result = await resp.json();
            console.log(`result`, result)
            console.log(`resp`, resp)
            inputEmail = '';
            email.value = '';
            inputPassword = '';
            window.location.href = 'login.html';

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
            console.log(`token`, token);
            console.log(`result`, result);

            userId = result.user._id;
            console.log(`userId`, userId);

            localStorage.setItem('access_token',JSON.stringify(token));
            localStorage.setItem('userId',JSON.stringify(userId));

            inputEmail = '';
            email.value = '';
            inputPassword = '';

            window.location.href = 'expense.html';
        } catch (error) {
            console.log(`error login`, error)
        }
}

