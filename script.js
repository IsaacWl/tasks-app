let list = localStorage.getItem("tasks") !== null ? JSON.parse(localStorage.getItem("tasks")) : [];

(function () {
    list.reverse();
    document.querySelector(".field").focus();
    for (value of list) {
        createElements(value.id)
        document.querySelectorAll("li").forEach(el => {
            if (el.textContent === value.text) {
            el.style.textDecoration = value.complete ? "line-through" : "";
        }
    })
}
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

        complete: false,
        i: list.length
    }

    list.push(taskModel);
    localStorage.setItem("tasks", JSON.stringify(list))
    form.reset()
    list.reverse()
    createElements(list[0].id)
    document.querySelector(".field").focus()
})

function createElements(id) {
    const tasks = document.querySelector("#tasks");
    const copy = [...list];
    const newArray = copy.filter(v => {
        return v.id === id
    })
    for (value of newArray) {
        const ul = document.createElement("ul");
        const li = document.createElement("li");
        // const deleteBtn = document.createElement("button");
        // const editBtn = document.createElement("button");
        const container = document.createElement("div");
        const deleteIcon = document.createElement('i');
        const editIcon = document.createElement('i');
        
        editIcon.className = 'far fa-edit c-b';
        deleteIcon.className = 'fas fa-trash-alt c-r';

        li.textContent = value.text;
        
        // editBtn.append(editIcon);
        // deleteBtn.append(deleteIcon);
        container.append(editIcon, deleteIcon)
        ul.append(li,container);
        tasks.append(ul);
        
        editIcon.setAttribute("key", value.id)
        deleteIcon.setAttribute("key", value.id)
        deleteIcon.addEventListener("click", deleteTask);
        editIcon.addEventListener("click", editTask);
        document.querySelectorAll("li").forEach(e => {
            e.addEventListener("click", handleComplete)
        })
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
    const key = e.target.nextElementSibling.getAttribute("key");
    console.log(key)
    const prev = e.target.parentNode.previousElementSibling;
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
    const replace = element.textContent.replace(/ /g, '-')
    location.hash = replace
    console.log(typeof location.hash)
    const slc = location.hash.slice(1);
    console.log(slc)
    const key = element.nextElementSibling.childNodes[0].getAttribute("key");
    const newArray = list.map(v => {
        return v.id === parseFloat(key) ? {...v, complete: !v.complete} : v
    })
    list = newArray
    localStorage.setItem("tasks", JSON.stringify(list))
    element.style.textDecoration = 
    element.style.textDecoration === "line-through" ? "" : "line-through"
}
