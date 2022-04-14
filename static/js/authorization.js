import { get, post } from './modules/fetchBooks.js';
import { showError, clickButtons } from './modules/complementary.js';

function actionUrl(action='logout') {
    if (appName == 'bk') {
        if (action == 'register') {
            return registerUrlBooks;
        }
        else if (action == 'login') {
            return loginUrlBooks;
        }
        else if (action == 'logout') {
            return logoutUrlBooks;
        }
    }
    else if (appName == 'td') {
        if (action == 'register') {
            return registerUrl;
        }
        else if (action == 'login') {
            return loginUrl;
        }
        else if (action == 'logout') {
            return logoutUrl;
        }
    }
}

function registerUserForm() {
    const authD = document.getElementById('authorizeDiv');
    const cache = new Array();
    for (let i=0; i<authD.children.length; i++) {
        cache.push(authD.children[i]);
    }

    let form = document.createElement('form');
    form.classList.add('row');
    
        let col = document.createElement('div');
        col.classList.add('col-5');
            let input = document.createElement('input');
            input.id = 'usernameR';
            input.type = 'text';
            input.classList.add('form-control');
            input.placeholder = 'Username...';
        col.appendChild(input);

        let col2 = document.createElement('div');
        col2.classList.add('col-5');
            let input2 = document.createElement('input');
            input2.id = 'passwordR';
            input2.type = 'password';
            input2.classList.add('form-control');
            input2.placeholder = 'Password...';
        col2.appendChild(input2);

        let col3 = document.createElement('div');
        col3.classList.add('col-2');
            let button = document.createElement('button');
            button.type = 'button';
            button.innerHTML = 'OK';
            button.classList.add('btn', 'btn-outline-primary');
            button.addEventListener('click', function() {
                registerUser();
            })
        col3.appendChild(button);

        let col4 = document.createElement('div');
        col4.classList.add('col');
            let error = document.createElement('div');
            error.id = 'errorR';
            error.classList.add('text-danger', 'hide');
        col4.appendChild(error);

    form.appendChild(col);
    form.appendChild(col2);
    form.appendChild(col3);
    form.appendChild(col4);

    for (let i=0; i<cache.length; i++) {
        cache[i].classList.add('hide');
    }
    authD.appendChild(form);

    document.addEventListener('click', (e) => {
        let el = e.target;
        if (authD.contains(el)) {
        } else {
            authD.innerHTML = '';
            for (let y=0; y<cache.length; y++) {
                authD.appendChild(cache[y]);
                cache[y].classList.remove('hide');
            }
        }
    })
}

clickButtons('registerButtonsForm', registerUserForm);

function registerUser() {
    let usernameR = document.getElementById('usernameR').value;
    let passwordR = document.getElementById('passwordR').value;
    if (usernameR.length < 1 || passwordR.length < 1) {
        let errorR = document.getElementById('errorR');
        showError(errorR, '1 or more characters');
        return;
    }

    const url = actionUrl('register');

    const form = new FormData();
    form.append('user', usernameR);
    form.append('pass', passwordR);

    post(url, form, 'POST')
        .then(data => {
            if (data.hasOwnProperty('error')) {
                let errorR = document.getElementById('errorR');
                showError(errorR, data.error);
            } else {
                window.location = data.redirect
            } 
        });
}

function loginUserForm() {
    const authD = document.getElementById('authorizeDiv');
    const cache = new Array();
    for (let i=0; i<authD.children.length; i++) {
        cache.push(authD.children[i]);
    }

    let form = document.createElement('form');
    form.classList.add('row');
    
        let col = document.createElement('div');
        col.classList.add('col-5');
            let input = document.createElement('input');
            input.id = 'usernameL';
            input.type = 'text';
            input.classList.add('form-control');
            input.placeholder = 'Username...';
        col.appendChild(input);

        let col2 = document.createElement('div');
        col2.classList.add('col-5');
            let input2 = document.createElement('input');
            input2.id = 'passwordL';
            input2.type = 'password';
            input2.classList.add('form-control');
            input2.placeholder = 'Password...';
            
        col2.appendChild(input2);

        let col3 = document.createElement('div');
        col3.classList.add('col-2');
            let button = document.createElement('button');
            button.type = 'button';
            button.innerHTML = 'OK';
            button.classList.add('btn', 'btn-outline-primary');
            button.addEventListener('click', function() {
                loginUser();
            })
        col3.appendChild(button);

        let col4 = document.createElement('div');
        col4.classList.add('col');
            let error = document.createElement('div');
            error.id = 'errorL';
            error.classList.add('text-danger', 'hide');
        col4.appendChild(error);

    form.appendChild(col);
    form.appendChild(col2);
    form.appendChild(col3);
    form.appendChild(col4);

    for (let i=0; i<cache.length; i++) {
        cache[i].classList.add('hide');
    }
    authD.appendChild(form);

    document.addEventListener('click', (e) => {
        let el = e.target;
        if (authD.contains(el)) {
        } else {
            authD.innerHTML = '';
            for (let y=0; y<cache.length; y++) {
                authD.appendChild(cache[y]);
                cache[y].classList.remove('hide');
            }
        }
    })
}

clickButtons('loginButtonsForm', loginUserForm);

function loginUser() {
    let usernameL = document.getElementById('usernameL').value;
    let passwordL = document.getElementById('passwordL').value;
    if (usernameL.length < 1 || passwordL.length < 1) {
        let errorL = document.getElementById('errorL');
        showError(errorL, '1 or more characters');
        return;
    }

    const url = actionUrl('login');

    const form = new FormData();
    form.append('user', usernameL);
    form.append('pass', passwordL);

    post(url, form, 'POST')
        .then(data => {
                if (data.hasOwnProperty('error')) {
                    let errorL = document.getElementById('errorL');
                    showError(errorL, data.error);
                } else {
                    window.location = data.redirect
                } 
        });
}

function logoutUser() {
    const url = actionUrl('logout');

    get(url)
        .then(data => {
            window.location = data.redirect;
        });
}

clickButtons('logoutButtons', logoutUser);