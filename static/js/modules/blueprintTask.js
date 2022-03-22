import { stateTask, updateTask, deleteTask } from './crudTask.js';
import { readOrUpdate } from './complementary.js';

function blueprint(el) {
    // Create task li element
    let task = document.createElement('li');
    task.id = el.id;
    task.classList.add('list-group-item');
    // Div for reading tasks
    let readDiv = document.createElement('div');
    readDiv.id = 'read' + el.id;
        // Inner text
        let text = document.createElement('p');
        text.id = 'p' + el.id;
        text.innerHTML = el.desc;
        readDiv.appendChild(text);
        // State button
        let stateB = document.createElement('button');
        stateB.type = 'button';
        stateB.innerHTML = 'State';
        stateB.classList.add('btn', 'btn-primary');
        stateB.addEventListener("click", function() {
            stateTask(el.id)
        });
        readDiv.appendChild(stateB);
        // Update button
        let updateB = document.createElement('button');
        updateB.id = 'ub' + el.id
        updateB.type = 'button';
        updateB.innerHTML = 'Update';
        updateB.classList.add('btn', 'btn-secondary', 'mx-3');
        updateB.addEventListener("click", function() {
            readOrUpdate(el.id, false);
        });
        readDiv.appendChild(updateB);
        // Delete button
        let deleteB = document.createElement('button');
        deleteB.id = 'db' + el.id
        deleteB.type = 'button';
        deleteB.innerHTML = 'Delete';
        deleteB.classList.add('btn', 'btn-danger');
        deleteB.addEventListener("click", function() {
            deleteTask(el.id);
        });
        readDiv.appendChild(deleteB);
        // Add read div to task li
        task.appendChild(readDiv);
    // Div for updating task
    let updateDiv = document.createElement('div');
    updateDiv.id = 'update' + el.id;
    updateDiv.classList.add('hide');
        // Label for input
        let labelD = document.createElement('label');
        labelD.for = 'input' + el.id;
        labelD.innerHTML = 'Update task'
        labelD.classList.add('form-label');
        updateDiv.appendChild(labelD);
        // Input for updating desc
        let inputD = document.createElement('input');
        inputD.id = 'input' + el.id;
        inputD.type = 'text';
        inputD.defaultValue = el.desc;
        inputD.placeholder = 'Update your task...'
        inputD.classList.add('form-control', 'mb-3');
        updateDiv.appendChild(inputD);
        // Button for confirming update
        let confirmB = document.createElement('button');
        confirmB.type = 'button';
        confirmB.innerHTML = 'Confirm';
        confirmB.classList.add('btn', 'btn-success');
        confirmB.addEventListener("click", function() {
            updateTask(el.id);
        });
        updateDiv.appendChild(confirmB);
        // Button for canceling update
        let cancelB = document.createElement('button');
        cancelB.type = 'button';
        cancelB.innerHTML = 'Cancel';
        cancelB.classList.add('btn', 'btn-secondary', 'mx-3');
        cancelB.addEventListener("click", function() {
            readOrUpdate(el.id, true);
        });
        updateDiv.appendChild(cancelB);
        // Add update div to task li
        task.appendChild(updateDiv);
    // Error element
    let errorT = document.createElement('p');
    errorT.id = 'errorT' + el.id;
    errorT.classList.add('hide', 'text-warning', 'mt-2');
    task.appendChild(errorT);

    return task;
}

export { blueprint };