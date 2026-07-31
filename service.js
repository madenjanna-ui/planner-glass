// =====================================
// MaDenFlow Service 3.2
// =====================================

let currentServiceMonth = "";

// =====================================
// Открыть журнал
// =====================================

function openService(month) {

    currentServiceMonth = month;

    const modal =
        document.getElementById("serviceModal");

    const list =
        document.getElementById("serviceList");

    const monthLabel =
        document.getElementById("serviceMonth");

    const totalLabel =
        document.getElementById("serviceTotal");

    list.innerHTML = "";

    monthLabel.textContent = month;

    const records =
        getServiceMonth(month);

    records.forEach((item, index) => {

        const row =
            document.createElement("div");

        row.className = "service-row";

        row.innerHTML = `

            <div class="service-date">
                ${item.date}
            </div>

            <div class="service-time">
                ${item.hours} ч ${item.minutes} мин
            </div>

        `;

        row.onclick = function () {

            showServiceMenu(index);

        };

        list.appendChild(row);

    });

    const total =
        getServiceTotal(month);

    totalLabel.textContent =
        total.hours +
        " ч " +
        total.minutes +
        " мин";

    modal.classList.remove("hidden");

}
// =====================================
// Закрыть журнал
// =====================================

function closeService() {

    document
        .getElementById("serviceModal")
        .classList.add("hidden");

}

// =====================================
// Открыть окно добавления
// =====================================

function openAddService() {

    document
        .getElementById("serviceAddModal")
        .classList.remove("hidden");

    const today = new Date();

    document.getElementById("serviceDate").value =
        today.toISOString().slice(0, 10);

    document.getElementById("serviceHours").value = "";

    document.getElementById("serviceMinutes").value = "";

}

// =====================================
// Закрыть окно добавления
// =====================================

function closeAddService() {

    document
        .getElementById("serviceAddModal")
        .classList.add("hidden");

}

// =====================================
// Сохранить запись
// =====================================

function saveServiceRecord() {

    const date =
        document.getElementById("serviceDate").value;

    const hours =
        Number(
            document.getElementById("serviceHours").value
        ) || 0;

    const minutes =
        Number(
            document.getElementById("serviceMinutes").value
        ) || 0;

    if (!date) {

        alert("Укажите дату.");

        return;

    }

    if (hours === 0 && minutes === 0) {

        alert("Введите время.");

        return;

    }

    addServiceRecord(

        currentServiceMonth,

        {
            date,
            hours,
            minutes
        }

    );

    closeAddService();

    openService(currentServiceMonth);

}

// =====================================
// Подключение кнопок
// =====================================

document
.getElementById("addServiceBtn")
.onclick = openAddService;

document
.getElementById("closeServiceBtn")
.onclick = closeService;

document
.getElementById("saveServiceBtn")
.onclick = saveServiceRecord;

document
.getElementById("cancelServiceBtn")
.onclick = closeAddService;
// =====================================
// Контекстное меню записи
// =====================================

function showServiceMenu(index) {

    const record =
        getServiceMonth(currentServiceMonth)[index];

    const action = prompt(
`1 - Изменить
2 - Удалить`
    );

    if (action === "1") {

        const date = prompt(
            "Дата",
            record.date
        );

        if (date === null) return;

        const hours = prompt(
            "Часы",
            record.hours
        );

        if (hours === null) return;

        const minutes = prompt(
            "Минуты",
            record.minutes
        );

        if (minutes === null) return;

        editServiceRecord(

            currentServiceMonth,

            index,

            {

                date,

                hours,

                minutes

            }

        );

        openService(currentServiceMonth);

        return;

    }

    if (action === "2") {

        if (
            confirm("Удалить запись?")
        ) {

            deleteServiceRecord(

                currentServiceMonth,

                index

            );

            openService(currentServiceMonth);

        }

    }

}

// =====================================
// Обновить журнал
// =====================================

function refreshService() {

    if (!currentServiceMonth) {
        return;
    }

    openService(currentServiceMonth);

}

// =====================================
// Экспорт
// =====================================

window.openService = openService;
window.closeService = closeService;

window.openAddService = openAddService;
window.closeAddService = closeAddService;

window.saveServiceRecord = saveServiceRecord;
window.showServiceMenu = showServiceMenu;

window.refreshService = refreshService;
