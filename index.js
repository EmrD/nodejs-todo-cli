const fs = require('fs');
const inquirer = require('inquirer');
const jsonfile = require('jsonfile');
const moment = require('moment');

const file = 'todos.json';

const loadTodos = () => {
    if (fs.existsSync(file)) {
        return jsonfile.readFileSync(file);
    } else {
        return [];
    }
};

const saveTodos = (todos) => {
    jsonfile.writeFileSync(file, todos);
};

const addTodo = async () => {
    const answers = await inquirer.prompt([
        { type: 'input', name: 'title', message: 'Enter the task title:' },
        { type: 'input', name: 'description', message: 'Enter the task description:' }
    ]);
    const { title, description } = answers;
    const todos = loadTodos();
    todos.push({ title, description, completed: false, createdAt: moment().format() });
    saveTodos(todos);
    console.log('Task added!');
};

const listTodos = () => {
    const todos = loadTodos();
    todos.forEach((todo, index) => {
        console.log(`${index + 1}. [${todo.completed ? 'Completed' : ' '}] ${todo.title} - ${todo.description} (Created at: ${todo.createdAt})`);
    });
};

const markComplete = async () => {
    const todos = loadTodos();
    const answers = await inquirer.prompt([
        { type: 'input', name: 'index', message: 'Enter the task number to mark as complete:' }
    ]);
    const { index } = answers;
    todos[index - 1].completed = true;
    saveTodos(todos);
    console.log('Task marked as complete!');
};

const deleteTodo = async () => {
    const todos = loadTodos();
    const answers = await inquirer.prompt([
        { type: 'input', name: 'index', message: 'Enter the task number to delete:' }
    ]);
    const { index } = answers;
    todos.splice(index - 1, 1);
    saveTodos(todos);
    console.log('Task deleted!');
};

const editTodo = async () => {
    const todos = loadTodos();
    const answers = await inquirer.prompt([
        { type: 'input', name: 'index', message: 'Enter the task number to edit:' },
        { type: 'input', name: 'title', message: 'Enter the new task title:' },
        { type: 'input', name: 'description', message: 'Enter the new task description:' }
    ]);
    const { index, title, description } = answers;
    todos[index - 1].title = title;
    todos[index - 1].description = description;
    saveTodos(todos);
    console.log('Task updated!');
};

const main = async () => {
    const answers = await inquirer.prompt([
        { type: 'list', name: 'action', message: 'What do you want to do?', choices: ['Add Task', 'List Tasks', 'Mark Task Complete', 'Delete Task', 'Edit Task', 'Exit'] }
    ]);

    switch (answers.action) {
        case 'Add Task':
            await addTodo();
            break;
        case 'List Tasks':
            listTodos();
            break;
        case 'Mark Task Complete':
            await markComplete();
            break;
        case 'Delete Task':
            await deleteTodo();
            break;
        case 'Edit Task':
            await editTodo();
            break;
        case 'Exit':
            process.exit();
    }
};

main();