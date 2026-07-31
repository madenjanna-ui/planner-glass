// =====================================
// MaDenFlow Tasks 3.2
// =====================================

// Загрузка задач дня
function loadTasks(date, container) {

    container.innerHTML = "";

    const list = getTasks(date);

    container.classList.remove(
        "two-columns",
        "three-columns"
    );

    if (list.length >= 3 && list.length <= 6) {
        container.classList.add("two-columns");
    }

    if (list.length >= 7) {
        container.classList.add("three-columns");
    }

    list.forEach((taskData, index) => {

        const task =
        document.createElement("div");

        task.className = "task";

        if (taskData.done) {
            task.classList.add("completed");
        }

        switch (taskData.priority) {

            case "important":
                task.classList.add("important");
                break;

            case "urgent":
                task.classList.add("urgent");
                break;

            default:
                task.classList.add("normal");

        }

        task.innerHTML = `

            <label class="task-check">

                <input
                    type="checkbox"
                    ${taskData.done ? "checked" : ""}
                >

                <span class="checkmark"></span>

            </label>

            <div class="task-text">
                ${taskData.text}
            </div>

        `;

        const checkbox =
        task.querySelector("input");

        checkbox.addEventListener(
            "change",
            function () {

                toggleTask(
                    date,
                    index,
                    checkbox.checked
                );

                renderWeek();

            }
        );

        task.addEventListener(
            "click",
            function (e) {

                if (
                    e.target.tagName === "INPUT" ||
                    e.target.classList.contains("checkmark")
                ) {
                    return;
                }

                showTaskMenu(
                    task,
                    date,
                    index
                );

            }
        );

        container.appendChild(task);

    });

}
// =====================================
// Контекстное меню задачи
// =====================================

function showTaskMenu(task, date, index) {

    closeTaskMenu();

    const menu = document.createElement("div");
    menu.className = "task-menu";

    menu.innerHTML = `

        <button data-action="important">
            Важное
        </button>

        <button data-action="urgent">
            Срочное
        </button>

        <button data-action="normal">
            Обычное
        </button>

        <div class="task-menu-line"></div>

        <button data-action="edit">
            Редактировать
        </button>

        <button data-action="delete">
            Удалить
        </button>

    `;

    document.body.appendChild(menu);

    const rect = task.getBoundingClientRect();

    let left = rect.left;
    let top = rect.bottom + 6;

    if (left + 220 > window.innerWidth) {
        left = window.innerWidth - 225;
    }

    if (top + menu.offsetHeight > window.innerHeight) {
        top = rect.top - menu.offsetHeight - 6;
    }

    menu.style.left = left + "px";
    menu.style.top = top + "px";

    menu.querySelectorAll("button").forEach(button => {

        button.onclick = function (e) {

            e.stopPropagation();

            switch (this.dataset.action) {

                case "important":

                    changePriority(
                        date,
                        index,
                        "important"
                    );

                    break;

                case "urgent":

                    changePriority(
                        date,
                        index,
                        "urgent"
                    );

                    break;

                case "normal":

                    changePriority(
                        date,
                        index,
                        "normal"
                    );

                    break;

                case "edit":

                    editTaskDialog(
                        date,
                        index
                    );

                    return;

                case "delete":

                    if (confirm("Удалить задачу?")) {

                        deleteTask(
                            date,
                            index
                        );

                    }

                    break;

            }

closeTaskMenu();

setTimeout(() => {
    renderWeek();
}, 50);
        };

    });

}
// =====================================
// Закрыть меню
// =====================================

function closeTaskMenu() {

    const menu =
        document.querySelector(".task-menu");

    if (menu) {
        menu.remove();
    }

}

// =====================================
// Закрытие меню по клику вне него
// =====================================

document.addEventListener("click", function (e) {
if (e.defaultPrevented) return;
    const menu =
        document.querySelector(".task-menu");

    if (!menu) return;

    if (menu.contains(e.target)) return;

    if (e.target.closest(".task")) return;

    closeTaskMenu();

});

// =====================================
// Диалог редактирования
// =====================================

function editTaskDialog(date, index) {

    closeTaskMenu();

    const task =
        getTasks(date)[index];

    const text =
        prompt(
            "Изменить задачу",
            task.text
        );

    if (text === null) {
        return;
    }

    if (text.trim() === "") {
        return;
    }

    editTask(
        date,
        index,
        text.trim()
    );

    renderWeek();

}

// =====================================
// Перерисовать один день
// =====================================

function refreshDay(date) {

    const day =
        document.querySelector(
            `[data-date="${date}"]`
        );

    if (!day) return;

    const container =
        day.querySelector(".tasks");

    if (!container) return;

    loadTasks(
        date,
        container
    );

}

// =====================================
// Обновить всё
// =====================================

function refreshTasks() {

    if (typeof renderWeek === "function") {

        renderWeek();

    }

}

// =====================================
// Экспорт
// =====================================

window.loadTasks = loadTasks;
window.showTaskMenu = showTaskMenu;
window.closeTaskMenu = closeTaskMenu;
window.refreshDay = refreshDay;
window.refreshTasks = refreshTasks;
