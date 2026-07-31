// =====================================
// MaDenFlow Storage 3.2
// =====================================

const STORAGE_KEY = "MaDenFlow_data";

const defaultData = {
    tasks: {},
    service: {}
};

let appData = loadStorage();

window.tasks = appData.tasks;
window.service = appData.service;

// =====================================
// Загрузка
// =====================================

function loadStorage() {

    try {

        const data = JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        );

        if (!data) {
            return structuredClone(defaultData);
        }

        if (!data.tasks) {
            data.tasks = {};
        }

        if (!data.service) {
            data.service = {};
        }

        return data;

    } catch (e) {

        console.warn("Ошибка чтения localStorage");

        return structuredClone(defaultData);

    }

}

// =====================================
// Сохранение
// =====================================

function saveStorage() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(appData)
    );

    if (typeof cloudSave === "function") {
        cloudSave();
    }

}

// =====================================
// Совместимость
// =====================================

function saveTasks() {
    saveStorage();
}

// =====================================
// Получить задачи дня
// =====================================

function getTasks(date) {

    if (!tasks[date]) {
        tasks[date] = [];
    }

    return tasks[date];

}

// =====================================
// Добавить задачу
// =====================================

function addTask(date, text) {

    getTasks(date).push({

        text: text,

        done: false,

        priority: "normal",

        created: Date.now()

    });

    saveStorage();

}

// =====================================
// Удалить задачу
// =====================================

function deleteTask(date, index) {

    if (!tasks[date]) return;

    tasks[date].splice(index, 1);

    if (tasks[date].length === 0) {
        delete tasks[date];
    }

    saveStorage();

}

// =====================================
// Изменить задачу
// =====================================

function editTask(date, index, text) {

    if (!tasks[date]) return;

    tasks[date][index].text = text;

    saveStorage();

}

// =====================================
// Выполнена
// =====================================

function toggleTask(date, index, done) {

    if (!tasks[date]) return;

    tasks[date][index].done = done;

    saveStorage();

}

// =====================================
// Приоритет
// =====================================

function changePriority(date, index, priority) {

    if (!tasks[date]) return;

    tasks[date][index].priority = priority;

    saveStorage();

    renderWeek();

}
// =====================================
// Получить записи служения месяца
// month = "2026-07"
// =====================================

function getServiceMonth(month) {

    if (!service[month]) {
        service[month] = [];
    }

    return service[month];

}

// =====================================
// Добавить запись служения
// =====================================

function addServiceRecord(month, record) {

    getServiceMonth(month).push({

        date: record.date,
        hours: Number(record.hours) || 0,
        minutes: Number(record.minutes) || 0,
        created: Date.now()

    });

    saveStorage();

}

// =====================================
// Изменить запись
// =====================================

function editServiceRecord(month, index, record) {

    if (!service[month]) return;

    service[month][index] = {

        ...service[month][index],
        date: record.date,
        hours: Number(record.hours) || 0,
        minutes: Number(record.minutes) || 0

    };

    saveStorage();

}

// =====================================
// Удалить запись
// =====================================

function deleteServiceRecord(month, index) {

    if (!service[month]) return;

    service[month].splice(index, 1);

    if (service[month].length === 0) {
        delete service[month];
    }

    saveStorage();

}

// =====================================
// Итого за месяц
// =====================================

function getServiceTotal(month) {

    if (!service[month]) {
        return {
            hours: 0,
            minutes: 0
        };
    }

    let totalMinutes = 0;

    service[month].forEach(item => {

        totalMinutes +=
            item.hours * 60 +
            item.minutes;

    });

    return {

        hours: Math.floor(totalMinutes / 60),

        minutes: totalMinutes % 60

    };

}

// =====================================
// Экспорт
// =====================================

window.saveStorage = saveStorage;

window.addTask = addTask;
window.deleteTask = deleteTask;
window.editTask = editTask;
window.toggleTask = toggleTask;
window.changePriority = changePriority;

window.getTasks = getTasks;

window.addServiceRecord = addServiceRecord;
window.editServiceRecord = editServiceRecord;
window.deleteServiceRecord = deleteServiceRecord;

window.getServiceMonth = getServiceMonth;
window.getServiceTotal = getServiceTotal;
