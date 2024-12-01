document.addEventListener("DOMContentLoaded", () => {
    const listDropdown = document.getElementById("listDropdown");
    const addListButton = document.getElementById("addListButton");
    const deleteListButton = document.getElementById("deleteListButton");
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTaskButton");
    const taskList = document.getElementById("taskList");
  
    let todoLists = JSON.parse(localStorage.getItem("todoLists")) || {};
  
    const saveToLocalStorage = () => {
      localStorage.setItem("todoLists", JSON.stringify(todoLists));
    };
  
    const renderLists = () => {
      listDropdown.innerHTML = `<option value="" disabled selected>Select a list</option>`;
      Object.keys(todoLists).forEach((listName) => {
        const option = document.createElement("option");
        option.value = listName;
        option.textContent = listName;
        listDropdown.appendChild(option);
      });
    };
  
    const renderTasks = () => {
      taskList.innerHTML = "";
      const selectedList = listDropdown.value;
      if (!selectedList || !todoLists[selectedList]) return;
  
      todoLists[selectedList].forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.text;
        li.className = task.completed ? "completed" : "";
  
        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "Undo" : "Complete";
        completeButton.addEventListener("click", () => {
          task.completed = !task.completed;
          saveToLocalStorage();
          renderTasks();
        });
  
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          todoLists[selectedList].splice(index, 1);
          saveToLocalStorage();
          renderTasks();
        });
  
        li.appendChild(completeButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
      });
    };
  
    addListButton.addEventListener("click", () => {
      const listName = prompt("Enter the name of the new list:");
      if (listName && !todoLists[listName]) {
        todoLists[listName] = [];
        saveToLocalStorage();
        renderLists();
      } else {
        alert("List already exists or invalid name!");
      }
    });
  
    deleteListButton.addEventListener("click", () => {
      const selectedList = listDropdown.value;
      if (selectedList && confirm(`Are you sure you want to delete the list "${selectedList}"?`)) {
        delete todoLists[selectedList];
        saveToLocalStorage();
        renderLists();
        taskList.innerHTML = ""; 
      }
    });
  
    addTaskButton.addEventListener("click", () => {
      const taskText = taskInput.value.trim();
      const selectedList = listDropdown.value;
      if (!selectedList) {
        alert("Please select a list first!");
        return;
      }
      if (taskText) {
        todoLists[selectedList].push({ text: taskText, completed: false });
        saveToLocalStorage();
        taskInput.value = "";
        renderTasks();
      } else {
        alert("Task cannot be empty!");
      }
    });
  
    listDropdown.addEventListener("change", () => {
      renderTasks();
    });
  
    renderLists();
    if (listDropdown.value) renderTasks();
  });
  