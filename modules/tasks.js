let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

export function loadTasks() {
    const taskTable = document.getElementById('task-table');
    taskTable.innerHTML = `
        <tr>
            <th>Done</th>
            <th>T.A.S.K.</th>
            <th>C.A.T.</th>
            <th>P.R.I.O.</th>
            <th>D.E.D.L.I.N.E.</th>
            <th>Delete</th>
        </tr>
    `;

    tasks.forEach((task, index) => {
        const row = taskTable.insertRow();
        row.innerHTML = `
            <td><input type="checkbox" ${task.completed ? 'checked' : ''} onchange="window.toggleTaskCompletion(${index})"></td>
            <td class="${task.completed ? 'completed' : ''}">${task.name}</td>
            <td>${task.category}</td>
            <td>${task.priority}</td>
            <td>${new Date(task.deadline).toLocaleString()}</td>
            <td><button onclick="window.deleteTask(${index})">🗑️</button></td>
        `;
    });
}

export function addTask() {
    const taskName = document.getElementById('task-name').value.trim();
    if (taskName === '') {
        alert('Task name cannot be empty.');
        return;
    }
    const newTask = {
        name: taskName,
        category: document.getElementById('category').value.trim(),
        priority: ['Low', 'Medium', 'High'][document.getElementById('priority-slider').value - 1],
        deadline: document.getElementById('deadline').value,
        completed: false,
        createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks();
    loadTasks();
    document.getElementById('task-form').reset();
}

export function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    loadTasks();
}

export function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    loadTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Make these functions available globally for inline event handlers
window.toggleTaskCompletion = toggleTaskCompletion;
window.deleteTask = deleteTask;