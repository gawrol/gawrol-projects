import { get } from './modules/fetch.js';
import { blueprint } from './modules/blueprintTask.js';
import { hideUpdateDelete } from './modules/complementary.js';

// Define task uls; C - completed, NC - not completed
const tasksC = document.getElementById('tasksC');
const tasksNC = document.getElementById('tasksNC');

// Define tasks array
let tasks = new Array();

function populate() {
    get(readUrl)
        .then(data => {
            if (data.tasks.length == 0) {
                return;
            }
            tasks = data.tasks;
            for (let i = 0; i < tasks.length; i++) {
                let task = blueprint(tasks[i]);
                if (tasks[i].state == false) {
                    tasksNC.appendChild(task);
                }
                else {
                    task.classList.add('state');
                    tasksC.appendChild(task);
                    hideUpdateDelete(tasks[i].id);
                }
            } 
        })
}

window.addEventListener('load', function () {
    if (window.location.pathname == indexUrl){
        populate();
    }
})

export {tasks};