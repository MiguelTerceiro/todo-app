const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

async function loadTasks() {
    listContainer.innerHTML = "";
    const res = await fetch("/api/tasks");
    const tasks = await res.json();
    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.dataset.id = task.id;

    const textSpan = document.createElement("span");
    textSpan.textContent = task.text;
    textSpan.style.marginRight = "10px";
    li.appendChild(textSpan);

    if (task.done) li.classList.add("checked");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar"; 
    editBtn.classList.add("edit-btn");

    const deleteBtn = document.createElement("span");
    deleteBtn.innerHTML = "\u00d7";
    deleteBtn.classList.add("delete-btn");

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    listContainer.appendChild(li);

    editBtn.addEventListener("click", async () => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = textSpan.textContent;
        li.insertBefore(input, textSpan);
        li.removeChild(textSpan);
        input.focus();

        input.addEventListener("keydown", async function (event) {
            if (event.key === "Enter") {
                const newText = input.value.trim();
                if (!newText) return;

                await fetch(`/api/tasks/${task.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: newText }),
                });

                textSpan.textContent = newText;
                li.insertBefore(textSpan, input);
                li.removeChild(input);
            }
        });

        input.addEventListener("blur", () => {
            li.insertBefore(textSpan, input);
            li.removeChild(input);
        });
    });

    deleteBtn.addEventListener("click", async () => {
        await fetch(`/api/tasks/${task.id}`, {
            method: "DELETE",
        });
        li.remove();
    });

    textSpan.addEventListener("click", async () => {
        li.classList.toggle("checked");
        const done = li.classList.contains("checked") ? 1 : 0;
        await fetch(`/api/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ done }),
        });
    });
}

async function addTask() {
    const text = inputBox.value.trim();
    if (text === "") {
        alert("Preencha este campo");
        return;
    }
    const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    const newTask = await res.json();
    addTaskToDOM(newTask);
    inputBox.value = "";
}

loadTasks();
