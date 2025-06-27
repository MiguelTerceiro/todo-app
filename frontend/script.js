const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Carrega todas as tarefas da API
async function loadTasks() {
    listContainer.innerHTML = "";
    const res = await fetch("/api/tasks");
    const tasks = await res.json();
    tasks.forEach(addTaskToDOM);
}

// Cria a tarefa visualmente no DOM
function addTaskToDOM(task) {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    if (task.done) li.classList.add("checked");

    // Círculo tarefa
    const circle = document.createElement("span");
    circle.className = "check-circle";
    circle.addEventListener("click", async () => {
        li.classList.toggle("checked");
        const done = li.classList.contains("checked") ? 1 : 0;

        await fetch(`/api/tasks/${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ done }),
        });
    });

    // Texto da tarefa
    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = task.text;

    // Botão editar
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = textSpan.textContent;
        input.className = "edit-input";

        li.replaceChild(input, textSpan);
        input.focus();

        input.addEventListener("keydown", async (e) => {
            if (e.key === "Enter") {
                const newText = input.value.trim();
                if (!newText) return;

                await fetch(`/api/tasks/${task.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: newText }),
                });

                textSpan.textContent = newText;
                li.replaceChild(textSpan, input);
            }
        });

        input.addEventListener("blur", () => {
            li.replaceChild(textSpan, input);
        });
    });

    // Botão excluir
    const deleteBtn = document.createElement("span");
    deleteBtn.innerHTML = "&#10005;";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", async () => {
        await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
        li.remove();
    });

    li.appendChild(circle);
    li.appendChild(textSpan);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    listContainer.appendChild(li);
}

// Adiciona nova tarefa
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
