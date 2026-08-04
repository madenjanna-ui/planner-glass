// =====================================
// MaDenFlow 2.1
// Основной движок планировщика
// =====================================

console.log("MaDenFlow 2.1 запущен 🚀");

// элементы

const planner =
document.getElementById("planner");


const weekTitle =
document.getElementById("weekTitle");



// дни недели

const weekDays = [
    "Пн",
    "Вт",
    "Ср",
    "Чт",
    "Пт",
    "Сб",
    "Вс"
];



// состояние

let currentDate =
new Date();


let selectedDate = null;


let selectedTask = null;





// =====================================
// Понедельник недели
// =====================================

function getMonday(date){

    let d =
    new Date(date);


    let day =
    d.getDay();


    if(day===0){

        day=7;

    }


    d.setDate(
        d.getDate()-day+1
    );


    return d;

}







// =====================================
// Построение недели
// =====================================

function renderWeek(){


    planner.innerHTML="";


    let monday =
    getMonday(currentDate);



    let sunday =
    new Date(monday);


    sunday.setDate(
        monday.getDate()+6
    );

// =====================================
// Максимальное количество задач недели
// =====================================

let maxTasks = 0;

for(let d=0; d<7; d++){

    const tempDate = new Date(monday);

    tempDate.setDate(
        monday.getDate()+d
    );

    const key =
    tempDate.toISOString()
    .split("T")[0];

    const count =
    getTasks(key).length;

    if(count > maxTasks){

        maxTasks = count;

    }

}

    weekTitle.textContent =

    `${monday.toLocaleDateString("ru-RU")}
    —
    ${sunday.toLocaleDateString("ru-RU")}`;



    for(let i=0;i<7;i++){


        let date =
        new Date(monday);


        date.setDate(
            monday.getDate()+i
        );



        let dateKey =
        date.toISOString()
        .split("T")[0];



        let today =
        date.toDateString()
        ===
        new Date().toDateString();




        let section =
        document.createElement("section");


        section.className="day";
const dayOfWeek = date.getDay();

if (dayOfWeek === 6 || dayOfWeek === 0) {
    section.classList.add("weekend");
}

        section.dataset.date=dateKey;



        section.innerHTML = `


        <div class="day-title">


            <div class="day-name">

            ${weekDays[i]}
            ${date.getDate()}


            <span
            class="day-status"
            data-date="${dateKey}">
            ⚪
            </span>


            ${today ? "⭐" : ""}

            </div>



            <button
            class="add-task-day"
            data-date="${dateKey}">
            ➕
            </button>


        </div>



        <div class="day-content">

            <div class="tasks"></div>

        </div>


        `;



        planner.appendChild(section);

    console.log(i, weekDays[i], dateKey);


        if(typeof loadTasks==="function"){


            loadTasks(

                dateKey,

                section.querySelector(".tasks")

            );


        }


    }



    updateDayStatus();

    activateDays();

    activateAddButtons();

    planner.classList.remove(

    "week-normal",
    "week-compact",
    "week-ultra"

);

if(maxTasks <= 2){

    planner.classList.add(
        "week-normal"
    );

}
else if(maxTasks <= 6){

    planner.classList.add(
        "week-compact"
    );

}
else{

    planner.classList.add(
        "week-ultra"
    );

}

planner.style.minHeight =
    window.innerHeight + "px";

}








// =====================================
// Выбор дня
// =====================================

function activateDays(){


    document
    .querySelectorAll(".day-title")
    .forEach(title=>{


        title.onclick=function(e){


            if(
                e.target.classList.contains(
                    "add-task-day"
                )
            ){

                return;

            }



            let day =
            this.closest(".day");



            selectedDate =
            day.dataset.date;



            document
            .querySelectorAll(".day")
            .forEach(d=>{

                d.classList.remove(
                    "selected-day"
                );

            });



            day.classList.add(
                "selected-day"
            );


        };


    });


}







// =====================================
// Плюс возле дня
// =====================================

function activateAddButtons(){


    document
    .querySelectorAll(".add-task-day")
    .forEach(button=>{


        button.onclick=function(e){


            e.stopPropagation();



            selectedDate =
            this.dataset.date;



            document
            .getElementById("taskModal")
            .classList
            .remove("hidden");


        };


    });


}







// =====================================
// Сохранить задачу
// =====================================

document
.getElementById("saveTaskBtn")
.onclick=function(){



    if(!selectedDate){

        alert(
            "Выберите день"
        );

        return;

    }




    let input =
    document.getElementById(
        "newTaskInput"
    );



    let text =
    input.value.trim();



    if(text===""){

        return;

    }



    addTask(
        selectedDate,
        text
    );



    input.value="";



    document
    .getElementById("taskModal")
    .classList
    .add("hidden");



    renderWeek();


};







// =====================================
// Отмена
// =====================================

document
.getElementById("cancelTaskBtn")
.onclick=function(){


    document
    .getElementById("taskModal")
    .classList
    .add("hidden");


};








// =====================================
// Недели назад/вперёд
// =====================================

document
.getElementById("prevWeek")
.onclick=function(){


    currentDate.setDate(
        currentDate.getDate()-7
    );


    renderWeek();


};



document
.getElementById("nextWeek")
.onclick=function(){


    currentDate.setDate(
        currentDate.getDate()+7
    );


    renderWeek();


};

// =====================================
// Кнопка "Служение"
// =====================================

document
.getElementById("serviceBtn")
.onclick = function () {

    const month =
    currentDate.toISOString().slice(0, 7);

    openService(month);

};

document
.getElementById("todayBtn")
.onclick=function(){


    currentDate =
    new Date();


    renderWeek();


};








// =====================================
// Статусы дней
// =====================================

function updateDayStatus(){


    document
    .querySelectorAll(".day-status")
    .forEach(status=>{


        let date =
        status.dataset.date;



        if(
            !tasks[date] ||
            tasks[date].length===0
        ){

            status.textContent="⚪";

            return;

        }




        let allDone =
        tasks[date]
        .every(item=>item.done);



        status.textContent =
        allDone
        ?
        "🟢"
        :
        "🟡";


    });


}








// =====================================
// Компактная шапка
// =====================================

const header =
document.querySelector(
    ".glass-header"
);



window.addEventListener(
"scroll",
()=>{


    if(window.scrollY>40){

        header.classList.add(
            "compact"
        );

    }
    else{

        header.classList.remove(
            "compact"
        );

    }


});

// =====================================
// Автоскрытие интерфейса
// =====================================

let uiTimer;

const body = document.body;

const topHandle =
document.getElementById("topHandle");

function resetUITimer(){

    clearTimeout(uiTimer);

    body.classList.remove(
        "ui-hidden"
    );

    uiTimer =
    setTimeout(hideUI,5000);

}

function hideUI(){

    document.body.classList.add("ui-hidden");

    planner.style.minHeight =
        window.innerHeight + "px";

}

function showUI(){

    document.body.classList.remove("ui-hidden");

    planner.style.minHeight = "";

    resetUITimer();

}

document
.getElementById("topHandle")
.addEventListener("click", showUI);

if(topHandle){

    topHandle.onclick =
    showUI;

}

resetUITimer();




// старт

renderWeek();

window.addEventListener(

    "resize",

    ()=>{

        planner.style.minHeight =
            window.innerHeight + "px";

    }

);
