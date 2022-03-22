import { tasks } from '../scripts.js';

function readOrUpdate(id, cancel) {
    let changeDiv = document.getElementById('update' + id);
    let readDiv = document.getElementById('read' + id);

    readDiv.classList.toggle('hide');
    changeDiv.classList.toggle('hide');

    let task = document.getElementById(id);
    task.classList.add('active');
    
    // If canceling update, return previous value to input
    if (cancel == true) {
        let objectId = id;
        const taskOld = tasks.find(({ id }) => id == objectId);
        document.getElementById('input'+id).value = taskOld.desc;
        task.classList.remove('active');  
    }
}

function hideUpdateDelete(id) {
    let ub = document.getElementById('ub'+id);
    ub.classList.toggle('hide');
    let db = document.getElementById('db'+id);
    db.classList.toggle('hide');
}

function showError(el, text) {
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

function clickButtons(button, method) {
    const collection = document.getElementsByClassName(button);

    for (let i = 0; i < collection.length; i++) {
            collection[i].addEventListener('click', method);
        }
}

export { readOrUpdate, hideUpdateDelete, showError, clickButtons };