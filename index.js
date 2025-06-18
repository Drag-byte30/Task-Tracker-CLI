const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname,'tasks.json')

const args = process.argv.slice(2)
const command = args[0]

if(!fs.existsSync(filePath)){
    fs.writeFileSync(filePath,'[]')
}

let tasks = JSON.parse(fs.readFileSync(filePath))

function saveTask(){
    fs.writeFileSync(filePath,JSON.stringify(tasks,null,2))
}

switch (command){
    case 'add' :
        addTask(args.slice(1).join(' '))
        break
    case 'update' :
        updateTask(parseInt(args[1]),args.slice(2).join(' '))
        break
    case 'delete' :
        deleteTask(parseInt(args[1]))
        break
    case 'list' :
        listTasks(args[1])
        break
    case 'mark' :
        markTask(parseInt(args[1]),args[2])
        break
    default:
        console.log('Unknown command')
}


function addTask(description){
    const newTask = {
        id:tasks.lenghth>0 ? tasks[tasks.length-1]+1 : 1,description,
        status:'todo',
        createdAt : new Date().toISOString(),
        updatedAt:new Date().toISOString()
    };
    tasks.push(newTask)
    saveTask()
    console.log('Task added',newTask)
}

function updateTask(id, newDescription) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.description = newDescription;
        task.updatedAt = new Date().toISOString();
        saveTask();
        console.log('Task updated:', task);
    } else {
        console.log('Task not found');
    }
}

function deleteTask(id) {
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id !== id);
    if (tasks.length < initialLength) {
        saveTask();
        console.log(`Task ${id} deleted`);
    } else {
        console.log('Task not found');
    }
}

function listTasks(filter) {
    let filteredTasks = tasks;

    if (filter) {
        filteredTasks = tasks.filter(t => t.status === filter);
    }

    if (filteredTasks.length === 0) {
        console.log('No tasks found.');
        return;
    }

    filteredTasks.forEach(task => {
        console.log(`[${task.id}] ${task.description} - ${task.status}`);
    });
}

function markTask(id, status) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        if (['todo', 'in-progress', 'done'].includes(status)) {
            task.status = status;
            task.updatedAt = new Date().toISOString();
            saveTask();
            console.log('Task status updated:', task);
        } else {
            console.log('Invalid status. Use todo, in-progress, or done.');
        }
    } else {
        console.log('Task not found');
    }
}
