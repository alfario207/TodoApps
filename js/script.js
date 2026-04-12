let todos = []
const RENDER = 'render-todos'

document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener('submit', (event) => {        
        event.preventDefault()
        addTodo()
    })

    loadData()
})

document.addEventListener(RENDER, () => {
    const uncompletedList = document.getElementById('todos')
    uncompletedList.innerHTML = '';

    const completedList = document.getElementById('completed-todos')
    completedList.innerHTML = ""
    
    todos.forEach((todoItem) => {
        const todoElement = makeTodo(todoItem)
        
        if (!todoItem.isComplete) {
            uncompletedList.append(todoElement)
        } else {
            completedList.append(todoElement)
        }
    })
}) 

function addTodo() { 
    const textTodo = document.getElementById('title').value
    const timestamp = document.getElementById('date').value

    const generateID = generateId()
    const todoObject = generateObject(generateID, textTodo, timestamp, false)
    todos.push(todoObject)

    document.dispatchEvent(new Event(RENDER))
}

function generateId() {
    return + new Date()
}

function generateObject(id, task, timestamp, isComplete) {
    return {
        id, 
        task, 
        timestamp, 
        isComplete
    }
}

function saveData() {
    localStorage.setItem('todos', JSON.stringify(todos))
}

function loadData() {
    todos = JSON.parse(localStorage.getItem('todos')) || []
    document.dispatchEvent(new Event(RENDER))
}

function makeTodo(todoObject) {
    const title = document.createElement('h2')
    title.innerText = todoObject.task

    const time = document.createElement('p')
    time.innerText = todoObject.timestamp

    const textContainer = document.createElement('div')
    textContainer.classList.add('inner')
    textContainer.append(title, time)

    const container = document.createElement('div')
    container.classList.add('item', 'shadow')
    container.append(textContainer)
    
    if (todoObject.isComplete) {
        const undoButton = document.createElement('button')
        undoButton.classList.add('undo-button')

        undoButton.addEventListener('click', () => {
            undoTaskCompleted(todoObject.id)
        })

        const trashButton = document.createElement('button')
        trashButton.classList.add('trash-button')

        trashButton.addEventListener('click', () => {
            removeTaskCompleted(todoObject.id)
        })

        container.append(undoButton, trashButton)
    } else {
        const checkButton = document.createElement('button')
        checkButton.classList.add('check-button')

        checkButton.addEventListener('click', () => {
            addTaskComplete(todoObject.id)
        })

        container.append(checkButton)
    }

    return container
}

function addTaskComplete(todoId) {
    const todoTarget = findTodo(todoId)

    if (todoTarget == null) {
        return
    }

    todoTarget.isComplete = true
    saveData()
    document.dispatchEvent(new Event(RENDER))
}

function removeTaskCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId)

    if (todoTarget === -1) {
        return
    }

    todos.splice(todoTarget, 1)
    saveData()
    document.dispatchEvent(new Event(RENDER))
}

function undoTaskCompleted(todoId) {
    const todoTarget = findTodo(todoId)

    if (todoTarget == null) {
        return
    }

    todoTarget.isComplete = false
    saveData()
    document.dispatchEvent(new Event(RENDER))
}

function findTodo(todoId) {
    for (const todoItem of todos) {
        if (todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
}

function findTodoIndex(todoId) {
    for(const index in todos) {
        if (todos[index].id === todoId) {
            return index
        }
    }
    return -1
}
