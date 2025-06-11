const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const datetimeInput = document.getElementById('datetime-input');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : '';
    li.innerHTML = `
      <span>${task.text} - <small>${task.datetime}</small></span>
      <div class="actions">
        <button onclick="toggleComplete(${index})">✔️</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  tasks.push({
    text: taskInput.value,
    datetime: datetimeInput.value,
    completed: false
  });
  taskInput.value = '';
  datetimeInput.value = '';
  saveTasks();
  renderTasks();
});

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newText = prompt('Edit task:', tasks[index].text);
  if (newText !== null && newText.trim() !== '') {
    tasks[index].text = newText;
    saveTasks();
    renderTasks();
  }
}

renderTasks();
