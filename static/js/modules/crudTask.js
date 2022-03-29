import { post } from './fetch.js';
import { readOrUpdate, hideUpdateDelete, showError, clickButtons } from './complementary.js';
import { blueprint } from './blueprintTask.js';
import { tasks } from '../scripts.js';

function createTask() {
    let input = document.getElementById('inputC');
    if (input.value.length < 1) {
        let errorC = document.getElementById('errorC');
        showError(errorC, '1 or more characters');
        return;
    }

    post(createUrl, {data: input.value}, 'POST')
        .then(data => {
            if (data.hasOwnProperty('login')) {
                window.location = data.login;
            }
            else if (data.hasOwnProperty('error')) {
                let errorC = document.getElementById('errorC');
                showError(errorC, data.error);
            }
            else if (data.task.length == 1) {
                let task = blueprint(data.task[0]);
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

clickButtons('createButtons', createTask);

function updateTask(id) {
    let input = document.getElementById('input'+id);
    if (input.value.length < 1) {
        let errorT = document.getElementById('errorT'+id);
        showError(errorT, '1 or more characters');
        return;
    }
    let desc = document.getElementById('p'+id);
    let task = document.getElementById(id);

    post(updateUrl, {dataText: input.value, dataId: id}, 'PATCH')
        .then(data => {
            if (data.hasOwnProperty('login')) {
                window.location = data.login;
            }
            else if (data.hasOwnProperty('error')) {
                let errorT = document.getElementById('errorT'+id);
                showError(errorT, data.error, id);
            }
            else if (data.task.id == id) {
                // Update tasks dictionary desc
                console.log(tasks);
                let objectId = id;
                const taskIndex = tasks.findIndex( ({ id }) => id == objectId);
                tasks[taskIndex].desc = data.task.desc;
                // Update p description tag
                desc.innerHTML = data.task.desc;     
                // Put updated task on top of list
                tasksNC.insertBefore(task, tasksNC.children[0]);
                // Hide update div, show read div
                readOrUpdate(id, false);
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

    post(deleteUrl, {dataId: id}, 'DELETE')
        .then(data => {
            if (data.hasOwnProperty('login')) {
                window.location = data.login;
            }
            else if (data.hasOwnProperty('error')) {
                let errorT = document.getElementById('errorT'+id);
                showError(errorT, data.error);
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

function stateTask(id) {
    let task = document.getElementById(id);

    post(stateUrl, {dataId: id}, 'PATCH')
        .then(data => {
            if (data.hasOwnProperty('login')) {
                window.location = data.login;
            }
            else if (data.hasOwnProperty('error')) {
                let errorT = document.getElementById('errorT'+id);
                showError(errorT, data.error);
            }
            else if (data.task.id == id) {
                task.classList.toggle('state');
                hideUpdateDelete(id);
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

export { stateTask, updateTask, deleteTask };