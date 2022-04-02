import { get, post } from './fetchBooks.js';
import { showError, clickButtons } from './complementary.js';

function registerUser() {
    let usernameR = document.getElementById('usernameR').value;
    let passwordR = document.getElementById('passwordR').value;
    if (usernameR.length < 1 || passwordR.length < 1) {
        let errorR = document.getElementById('errorR');
        showError(errorR, '1 or more characters');
        return;
    }

    const form = new FormData();
    form.append('user', usernameR);
    form.append('pass', passwordR);

    post(registerUrlBooks, form, 'POST')
        .then(data => {
            if (data.hasOwnProperty('error')) {
                let errorR = document.getElementById('errorR');
                showError(errorR, data.error);
            } else {
                window.location = data.redirect
            } 
        });
}

clickButtons('registerButtonsBooks', registerUser);

function loginUser() {
    let usernameL = document.getElementById('usernameL').value;
    let passwordL = document.getElementById('passwordL').value;
    if (usernameL.length < 1 || passwordL.length < 1) {
        let errorL = document.getElementById('errorL');
        showError(errorL, '1 or more characters');
        return;
    }

    const form = new FormData();
    form.append('user', usernameL);
    form.append('pass', passwordL);

    post(loginUrlBooks, form, 'POST')
        .then(data => {
                if (data.hasOwnProperty('error')) {
                    let errorL = document.getElementById('errorL');
                    showError(errorL, data.error);
                } else {
                    window.location = data.redirect
                } 
        });
}

clickButtons('loginButtonsBooks', loginUser);

function logoutUser() {
    get(logoutUrlBooks)
        .then(data => {
            console.log(data.redirect);
            window.location = data.redirect;
        });
}

clickButtons('logoutButtonsBooks', logoutUser);