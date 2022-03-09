// Substract CSRF token from cookie for AJAX POST request
const cookie = document.cookie;
const csrftoken = cookie.substring(cookie.indexOf('=') + 1);

// Define task uls 
const tasksC = document.getElementById('tasksC');
const tasksNC = document.getElementById('tasksNC');

let tasks = new Array();

async function getTasks(url = '') {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

// Example POST method implementation:
async function postTask(url = '', data = {}, reqMETH = 'POST') {
    // Default options are marked with *
    const response = await fetch(url, {
        // method: 'POST', // *GET, POST, PUT, DELETE, etc.
        method: reqMETH,
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrftoken,
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

function blueprintTask(taskN) {
    let task = document.createElement('li');
    task.id = taskN.id;
    task.classList.add('list-group-item');
    // Div for reading tasks
    let read = document.createElement('div');
    read.id = 'read' + taskN.id;
        // Inner text
        let p = document.createElement('p');
        p.id = 'p' + taskN.id;
        p.innerHTML = taskN.desc;
        read.appendChild(p);
        // State button
        let stateB = document.createElement('button');
        stateB.type = 'button';
        stateB.innerHTML = 'State';
        stateB.classList.add('btn', 'btn-primary');
        stateB.addEventListener("click", function() {
            state(taskN.id)
        });
        read.appendChild(stateB);
        // Update button
        let updateB = document.createElement('button');
        updateB.id = 'ub' + taskN.id
        updateB.type = 'button';
        updateB.innerHTML = 'Update';
        updateB.classList.add('btn', 'btn-secondary', 'mx-3');
        updateB.addEventListener("click", function() {
            ru(taskN.id, false);
        });
        read.appendChild(updateB);
        // Delete button
        let deleteB = document.createElement('button');
        deleteB.id = 'db' + taskN.id
        deleteB.type = 'button';
        deleteB.innerHTML = 'Delete';
        deleteB.classList.add('btn', 'btn-danger');
        deleteB.addEventListener("click", function() {
            deleteTask(taskN.id);
        });
        read.appendChild(deleteB);
        // Add read div to task li
        task.appendChild(read);
    // Div for updating task
    let change = document.createElement('div');
    change.id = 'change' + taskN.id;
    change.classList.add('hide');
        // Label for input
        let labelD = document.createElement('label');
        labelD.for = 'input' + taskN.id;
        labelD.innerHTML = 'Update task'
        labelD.classList.add('form-label');
        change.appendChild(labelD);
        // Input for updating desc
        let inputD = document.createElement('input');
        inputD.id = 'input' + taskN.id;
        inputD.type = 'text';
        inputD.defaultValue = taskN.desc;
        inputD.placeholder = 'Update your task...'
        inputD.classList.add('form-control', 'mb-3');
        change.appendChild(inputD);
        // Button for confirming update
        let confirmU = document.createElement('button');
        confirmU.type = 'button';
        confirmU.innerHTML = 'Confirm';
        confirmU.classList.add('btn', 'btn-success');
        confirmU.addEventListener("click", function() {
            updateTask(taskN.id);
        });
        change.appendChild(confirmU);
        // Button for canceling update
        let cancelU = document.createElement('button');
        cancelU.type = 'button';
        cancelU.innerHTML = 'Cancel';
        cancelU.classList.add('btn', 'btn-secondary', 'mx-3');
        cancelU.addEventListener("click", function() {
            ru(taskN.id, true);
        });
        change.appendChild(cancelU);
        // Add update div to task li
        task.appendChild(change);
    // Error element
    let errorT = document.createElement('p');
    errorT.id = 'errorT' + taskN.id;
    errorT.classList.add('hide', 'text-warning', 'mt-2');
    task.appendChild(errorT);

    return task;
}

function ru(id, cancel) {
    let changeDiv = document.getElementById('change' + id);
    let readDiv = document.getElementById('read' + id);

    readDiv.classList.toggle('hide');
    changeDiv.classList.toggle('hide');

    let task = document.getElementById(id);
    task.classList.add('active');
    
    // If canceling update, return previous value to input
    if (cancel == true) {
        let objectId = id;
        const taskOld = tasks.find( ({ id }) => id == objectId);
        document.getElementById('input'+id).value = taskOld.desc;
        task.classList.remove('active');  
    }
}

function hideB(id) {
    let ub = document.getElementById('ub'+id);
    ub.classList.toggle('hide');
    let db = document.getElementById('db'+id);
    db.classList.toggle('hide');
}

function showE(el, text) {
    el.innerHTML = text;
    el.classList.toggle('hide');

    setTimeout(() => {
        document.addEventListener("click", function deleteDetect(event) {
            if (event) {
                el.innerHTML = '';
                el.classList.toggle('hide');
                document.removeEventListener('click', deleteDetect);
            }
        });
    }, 200);
}

function createTask() {
    let input = document.getElementById('inputC');
    if (input.value.length < 1) {
        let errorC = document.getElementById('errorC');
        showE(errorC, '1 or more characters');
        return;
    }

    postTask(createUrl, {data: input.value}, 'POST')
        .then(data => {
            if (data.hasOwnProperty('login') || data.hasOwnProperty('redirect')) {
                window.location = data.login;
            }
            else if (data.hasOwnProperty('error')) {
                let errorC = document.getElementById('errorC');
                showE(errorC, data.error);
            }
            else if (data.task.length == 1) {
                let task = blueprintTask(data.task[0]);
                tasksNC.insertBefore(task, tasksNC.children[0]);
                input.value = '';
                if (tasks.length > 1) {
                    tasks.unshift(data.task[0]);
                } else {
                    tasks.push(data.task[0]);
                }
            }
        });
}

function updateTask(id) {
    let input = document.getElementById('input'+id);
    if (input.value.length < 1) {
        let errorT = document.getElementById('errorT'+id);
        showE(errorT, '1 or more characters');
        return;
    }
    let desc = document.getElementById('p'+id);
    let task = document.getElementById(id);

    postTask(updateUrl, {dataText: input.value, dataId: id}, 'PATCH')
        .then(data => {
            if (data.hasOwnProperty('login') || data.hasOwnProperty('redirect')) {
                window.location = data.login;
            }
            else if (data.hasOwnProperty('error')) {
                let errorT = document.getElementById('errorT'+id);
                showE(errorT, data.error, id);
            }
            else if (data.task.id == id) {
                // Update tasks dictionary desc
                let objectId = id;
                const taskIndex = tasks.findIndex( ({ id }) => id == objectId);
                tasks[taskIndex].desc = data.task.desc;
                // Update p description tag
                desc.innerHTML = data.task.desc;     
                // Put updated task on top of list
                tasksNC.insertBefore(task, tasksNC.children[0]);
                // Hide update div, show read div
                ru(id, false);
                task.classList.remove('active');  
            }
            else {
                console.log('Task id from ajax request and server response doesnt match');
            }
        });
}

function deleteTask(id) {
    const deleteB = document.getElementById('db'+id);
    deleteB.innerHTML = 'OK?';
    setTimeout(() => {
        document.addEventListener("click", function deleteDetect(event) {
            let clickedEl = event.target;    
                if (clickedEl == deleteB) {
                    deleteTaskConf(id);
                    return;
                }
                else {
                    deleteB.innerHTML = 'Delete';
                    document.removeEventListener('click', deleteDetect);
                    return;
                }
        });
    }, 200);
}

function deleteTaskConf(id) {
    let task = document.getElementById(id);

    postTask(deleteUrl, {dataId: id}, 'DELETE')
        .then(data => {
            if (data.hasOwnProperty('login') || data.hasOwnProperty('redirect')) {
                window.location = data.login;
            }
            else if (data.hasOwnProperty('error')) {
                let errorT = document.getElementById('errorT'+id);
                showE(errorT, data.error);
            }
            else if (data.task.id == id) {
                task.remove();
                let objectId = id;
                const taskIndex = tasks.findIndex( ({ id }) => id == objectId);
                tasks.splice(taskIndex, 1);
            }
            else {
                console.log('Task id from ajax request and server response doesnt match');
            }
        });
}

function state(id) {
    let task = document.getElementById(id);

    postTask(stateUrl, {dataId: id}, 'PATCH')
        .then(data => {
            if (data.hasOwnProperty('login') || data.hasOwnProperty('redirect')) {
                window.location = data.login;
            }
            else if (data.hasOwnProperty('error')) {
                let errorT = document.getElementById('errorT'+id);
                showE(errorT, data.error);
            }
            else if (data.task.id == id) {
                task.classList.toggle('state');
                hideB(id);
                let objectId = id;
                const taskIndex = tasks.findIndex( ({ id }) => id == objectId);
                if (data.task.state == true) {
                    tasksC.insertBefore(task, tasksC.children[0]);
                    tasks[taskIndex].state = true;
                }
                else if (data.task.state == false) {
                    tasksNC.insertBefore(task, tasksNC.children[0]);
                    tasks[taskIndex].state = false;
                }
            }
            else {
                console.log('Task id from ajax request and server response doesnt match');
            }
        });
}

function registerUser() {
    let usernameR = document.getElementById('usernameR').value;
    let passwordR = document.getElementById('passwordR').value;
    if (usernameR.length < 1 || passwordR.length < 1) {
        let errorR = document.getElementById('errorR');
        showE(errorR, '1 or more characters');
        return;
    }

    postTask(registerUrl, {data: {user: usernameR, pass: passwordR}}, 'POST')
        .then(data => {
            if (data.hasOwnProperty('error')) {
                let errorR = document.getElementById('errorR');
                showE(errorR, data.error);
            } else {
                window.location = data.redirect
            } 
        });
}

function loginUser() {
    let usernameL = document.getElementById('usernameL').value;
    let passwordL = document.getElementById('passwordL').value;
    if (usernameL.length < 1 || passwordL.length < 1) {
        let errorL = document.getElementById('errorL');
        showE(errorL, '1 or more characters');
        return;
    }

    postTask(loginUrl, {data: {user: usernameL, pass: passwordL}}, 'POST')
        .then(data => {
                if (data.hasOwnProperty('error')) {
                    let errorL = document.getElementById('errorL');
                    showE(errorL, data.error);
                } else {
                    window.location = data.redirect
                } 
        });
}

function logoutUser() {
    getTasks(logoutUrl)
        .then(data => {
            window.location = data.redirect;
        });
}

function populate() {
    getTasks(readUrl)
        .then(data => {
            if (data.tasks.length == 0) {
                return;
            }
            tasks = data.tasks;
            console.log(data.tasks);
            for (let i = 0; i < tasks.length; i++) {
                let task = blueprintTask(tasks[i]);
                if (tasks[i].state == false) {
                    tasksNC.appendChild(task);
                }
                else {
                    task.classList.add('state');
                    tasksC.appendChild(task);
                    hideB(tasks[i].id);
                }
            } 
        })
}

window.addEventListener('load', function () {
    if (window.location.pathname == indexUrl){
        populate();
    }
})
