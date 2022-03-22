import { get, post } from './fetch.js';
import { showError, clickButtons } from './complementary.js';

function registerUser() {
    let usernameR = document.getElementById('usernameR').value;
    let passwordR = document.getElementById('passwordR').value;
    if (usernameR.length < 1 || passwordR.length < 1) {
        let errorR = document.getElementById('errorR');
        showError(errorR, '1 or more characters');
        return;
    }

    post(registerUrl, {data: {user: usernameR, pass: passwordR}}, 'POST')
        .then(data => {
            if (data.hasOwnProperty('error')) {
                let errorR = document.getElementById('errorR');
                showError(errorR, data.error);
            } else {
                window.location = data.redirect
            } 
        });
}

clickButtons('registerButtons', registerUser);

function loginUser() {
    let usernameL = document.getElementById('usernameL').value;
    let passwordL = document.getElementById('passwordL').value;
    if (usernameL.length < 1 || passwordL.length < 1) {
        let errorL = document.getElementById('errorL');
        showError(errorL, '1 or more characters');
        return;
    }

    post(loginUrl, {data: {user: usernameL, pass: passwordL}}, 'POST')
        .then(data => {
                if (data.hasOwnProperty('error')) {
                    let errorL = document.getElementById('errorL');
                    showError(errorL, data.error);
                } else {
                    window.location = data.redirect
                } 
        });
}

clickButtons('loginButtons', loginUser);

function logoutUser() {
    get(logoutUrl)
        .then(data => {
            window.location = data.redirect;
        });
}

clickButtons('logoutButtons', logoutUser);