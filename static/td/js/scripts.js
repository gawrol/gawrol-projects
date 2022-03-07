// Substract CSRF token from cookie for AJAX POST request
const cookie = document.cookie;
const csrfToken = cookie.substring(cookie.indexOf('=') + 1);

// Define task uls 
const tasksC = document.getElementById("tasksC");
const tasksNC = document.getElementById("tasksNC");

// Example POST method implementation:
async function postState(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken,
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

function state(url, id) {
    let taskId = 'task' + id;
    let task = document.getElementById(taskId);

    postState(url, {})
        .then(data => {
            if (data.task.id == id) {
                task.classList.toggle('state');
                if (data.task.state == true) {
                    tasksC.insertBefore(task, tasksC.children[0]);
                }
                else if (data.task.state == false) {
                    tasksNC.insertBefore(task, tasksNC.children[0]);
                }
            }
            else {
                console.log('Task id from ajax request and server response doesnt match');
            }
        });
}

window.addEventListener('load', function () {
})
