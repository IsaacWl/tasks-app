let list = localStorage.getItem("tasks") !== null ? JSON.parse(localStorage.getItem("tasks")) : [];

(function () {
    document.querySelector(".field").focus();
    createElements()
    addCompleteToList()
})()

document.querySelector("#add").disabled = true;

document.querySelector('[name="task"]').addEventListener("keyup", function() {    
    this.value.length < 1 ? this.nextElementSibling.disabled = true : 
    this.nextElementSibling.disabled = false;
})

document.querySelector("#add").addEventListener("click", function() {
    this.disabled = true;
    const form = document.querySelector("form");
    const information = new FormData(form);
    const task = information.get("task");
    if (!task.trim().length) {
        return;
    }
    const taskModel = {
        id: Math.random(),
        text: task,
        complete: false
    }

    list.push(taskModel);
    localStorage.setItem("tasks", JSON.stringify(list))
    form.reset()
    createElements()
    document.querySelector(".field").focus()
})

function createElements() {
    const tasks = document.querySelector("#tasks");
    const values = [...list];
    tasks.textContent = '';
    for (const value of values) {
        const li = document.createElement("li");
        const container = document.createElement("div");
        const deleteIcon = document.createElement('i');
        const editIcon = document.createElement('i');
        const text = document.createElement('h5');

        editIcon.className = 'far fa-edit c-b';
        deleteIcon.className = 'fas fa-trash-alt c-r';
        li.className = 'items';

        text.textContent = value.text;
        
        container.append(editIcon, deleteIcon)
        li.append(text, container)
        tasks.append(li);
        
        editIcon.setAttribute("key", value.id)
        deleteIcon.setAttribute("key", value.id)
        li.setAttribute('key', value.id)
        li.addEventListener('click',handleComplete)
        deleteIcon.addEventListener("click", deleteTask)
        editIcon.addEventListener("click", editTask)
    }
}

function deleteTask(e) {
    const node = e.target.parentNode.parentNode;
    const key = e.target.getAttribute("key")
    const copy = list.filter(v => {
        return v.id !== parseFloat(key);
    })
    list = [...copy]
    localStorage.setItem("tasks", JSON.stringify(list))
    console.log(list)
    node.classList.add("animate");
    node.addEventListener("animationend", function() {
        node.remove()
    })
}

function editTask(e) {
    const key = e.target.getAttribute("key");
    const prev = e.target.parentNode.previousElementSibling;
    console.log(prev)
    console.log(key)
    const content = list.filter(v => {
        return v.id === parseFloat(key);
    })
    prev.contentEditable = true;
    prev.focus()
    prev.textContent = "";
    prev.style.textDecoration = "";
    prev.addEventListener("blur", function(e) {
        prev.contentEditable = false;
        if (prev.textContent === "") {
            prev.textContent = content[0].text;
        }
        let newArray = list.map(v => {
            return v.id === parseFloat(key) ? {...v, text: prev.textContent, complete: false} : {...v};
        })
        list = newArray;
        localStorage.setItem("tasks", JSON.stringify(list))
        console.log(newArray)
    })
}

function handleComplete(e) {
    const element = e.target;
    const key = element.getAttribute('key')
    const newArray = list.map(v => {
        return v.id === parseFloat(key) ? {...v, complete: !v.complete} : v
    })
    list = newArray
    localStorage.setItem("tasks", JSON.stringify(list))
    addCompleteToList()
}
function addCompleteToList() {
    const elements = document.querySelectorAll('.items');
    elements.forEach(element => {
        for (const value of list) {
            if (element.getAttribute('key') == value.id) {
                element.style.textDecoration = value.complete ? 
                'line-through':'';
            }
            continue;   
        }
    })
}
