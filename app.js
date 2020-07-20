function id(x){
    return document.getElementById(x)
}
function capitalize(str){ 
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++){ 
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1); 
    }
    return splitStr.join(' '); 
}

var activeTasks = new Array();

function arrayRemove(name){
    const index = activeTasks.indexOf(name);
    if (index > -1) {
        activeTasks.splice(index, 1);
    }
}
function rmvExtraSpaces(name){
    var listForm = name.split("")
    var len = name.length
    var vrlen = len
    var rmvList = new Array();
    for (var i = 0;i < len;i++){
        if(listForm[i] == " "){
            if(listForm[i-1] == " "){
                rmvList.push(i-1)
                vrlen = vrlen-1
            }
        }
    }
    var count = 0
    for (var j of rmvList){
        listForm.splice(j-count, 1)
        count++
    }
    if(listForm[vrlen-1] == " "){
        listForm.splice(vrlen-1,1)
    }
    if(listForm[0] == " "){
        listForm.splice(0,1)
    }
    return listForm.join("")
}


var beingEdited = {
    name: "",
    oldValue: ""
};
var subTasks = new Object();
var untitledSub = new Object();
 
(function clickEnter(){

    // IIFE

    document.body.addEventListener("keydown", function(e){
        if(e.keyCode == 84 && e.altKey){
            e.preventDefault()
            customAlert(`Task Name <i onclick='closeAlert()' class='fas fa-window-close'></i>`,`Set the name of your task<br/>You can put several <b>sub-tasks</b> under this`,'Submit','nameTask()')
        }
    })

    var input = document.querySelector("#alert-input")
    input.addEventListener("keydown", function(e){
        if(e.keyCode == 13 && input.value.length >= 4){
            if(alertName == "Submit"){
                nameTask()
            }
        }
    })
}())

var containerCount = 1
var alertName = ""

function Container(name){

    // This is a component, not function


    var editedName = name.split(" ").join("-").toLowerCase()
    var container = document.createElement("div")
    container.className = "todo-container"
    container.id = `Task-${editedName}`
    // container.onclick = `newTask(${containerCount+1})`
    container.innerHTML = 
    `
        <div class = "task-name">
            <input class = 'task-input' id="task-input-${editedName}" type="text" disabled=true value = "${name}" maxlength = "20">
            <i class="fas fa-pen ripple" id = "pen-of-${editedName}" onclick = "editTaskName('${editedName}')"></i>
            <i class="fas fa-check yesorno ripple" id = "check-of-${editedName}" onclick = "yesEdit('${editedName}')"></i>
            <i class="fas fa-times yesorno ripple" id = "times-of-${editedName}" onclick = "noEdit('${editedName}')"></i>
        </div>
        <div class = "sub-container" id = "sub-of-${editedName}">
            <div class = "sub-heading">
                <i class="fas fa-caret-down"></i> 
                Sub Tasks 
                <button class = "sub-add-btn" id = "sub-add-btn-of-${editedName}" onclick = "newSubTask('${editedName}')">
                    <span class = "enlarge-section"><i class = "fas fa-plus"></i>Sub Task</span>
                </button>
            </div>
            <div class = "sub-body" id = "sub-body-of-${editedName}">
                <div class = "sub-tasks-div" id = "sub-tasks-div-of-${editedName}"></div>
            </div>
        </div>
        <div class = "delete-task" id = "delete-${editedName}" onclick = "deleteTask('${editedName}')">
            <span>
                <i class="fas fa-trash-alt"></i>
                Delete this task
            </span>
        </div>
    `
    activeTasks.push(editedName)
    return container
}

function Subtask(main){

    // This is a component, not a function

    /*
    <div class = "sub-task-name" id = "${editedName}-sub-task-name-example-sub-task">
        <input type = "checkbox" class = "checkboxes" id = "${editedName}-checkbox-of-example-sub-task">
        <input type = "text" class = "sub-task-input" id = "${editedName}-sub-task-input-exmaple-sub-task" value = "Example Sub Task">
    </div>
    */

    var subTask = document.createElement("div")
    subTask.id = `${main}-sub-task`
    subTask.className = "sub-task-name"
    subTask.innerHTML = `
        <input type = "checkbox" class = "checkboxes" id = "${main}-sub-checkbox">
        <input type = "text" class = "sub-task-input" id = "${main}-sub-task-input" value = "">
    `
    return subTask
}

function countUtTasks(main){
    untitledSub[main] = 0
    var div = id("sub-tasks-div-of-"+main).children
    for (var child of div){
        if(child.children[1].value.substring(0,13) == "Untitled Task" ){
            untitledSub[main] += 1
        }
    }
}

function newSubTask(main){
    subTasks[main] += 1
    var sub = new Subtask(main)
    var div = id("sub-tasks-div-of-"+main)
    var subInput = sub.children[1]
    div.appendChild(sub)
    countUtTasks(main)
    subInput.value = "Untitled Task ["+untitledSub[main]+"]"
    subInput.focus()
    subInput.select()
    subInput.addEventListener("keydown", function(e){
        if(e.keyCode == 13){
            subInput.disabled = true
        }
    })
}

function newTask(name){
    containerCount++
    var shortt = name.split(" ").join("-").toLowerCase()
    subTasks[shortt] = 0
    untitledSub[shortt] = 0
    var todoContainer = new Container(name)
    id("active-todos").appendChild(todoContainer)
}

function customAlert(name,para,btn,onclck){
    id("alert-input").value = ""
    id('alert-heading').innerHTML = name
    id("alert-para").innerHTML = para
    id("alert-btn").innerText = btn
    id("alert-btn").setAttribute("onclick",onclck)
    id("masked-page").style.display = "block"
    id("main").style.filter = "blur(10px)"
    id("alert-box").style.display = "block"
    id("add-btn").style.display = "none"
    id("alert-input").focus()
    alertName = btn
}
function closeAlert(){
    id("masked-page").style.display = "none"
    id("main").style.filter = "blur(0px)"
    id("alert-box").style.display = "none"
    id("add-btn").style.display = "block"
}

function nameTask(){
    var name = capitalize(id("alert-input").value)
    name = rmvExtraSpaces(name)
    var editedName = name.split(" ").join("-").toLowerCase()
    var eligible = true
    if(activeTasks.includes(editedName)){
        alert("There is already a task existing with the name "+name+".\nYou can't add more Tasks with a same name")
        eligible = false
    }
    if(name.length > 3 && eligible){ 
        newTask(name)
        closeAlert()
    }
    else{
        id("alert-input").focus()
    }
}

function editTaskName(name){
    if(beingEdited.name == ""){
        var input = id("task-input-"+name)
        var inputs = document.getElementsByClassName("task-input")
        for (var taskInput of inputs){
            taskInput.disabled = true
        }
        input.disabled = false
        input.addEventListener("keydown", function(e){
            if(e.keyCode == 13){
                yesEdit(name)
            }
        })
        var val = input.value
        input.value = "" 
        input.value = val
        beingEdited.oldValue = val
        beingEdited.name = name
        input.select()
        input.focus()
        id("pen-of-"+name).style.display = "none"
        id("check-of-"+name).style.visibility = "visible"
        id("times-of-"+name).style.visibility = "visible"
    }
    else{
        var nameOld = "task-input-"+beingEdited.oldValue.split(" ").join("-").toLowerCase()
        alert("The editing of "+beingEdited.oldValue+"(Task) is under pending\nEdit it first before you edit the name of this task.")
        id(nameOld).focus()
    }    
}

function yesEdit(name){

    // Editing begins

    var taskInput = id("task-input-"+name)
    var oldValue = beingEdited.oldValue.split(" ").join("-").toLowerCase()
    var newValue = (rmvExtraSpaces(taskInput.value)).split(" ").join("-").toLowerCase()
    if(newValue != ""){
        if(!activeTasks.includes(newValue) && newValue != oldValue){
            var taskBox = id("Task-"+name)
            var yesedit = id("check-of-"+name)
            var noedit = id("times-of-"+name)
            var pen = id("pen-of-"+name)
            var delTask = id("delete-"+name)
            pen.style.display = "inline"
            yesedit.style.visibility = "hidden"
            noedit.style.visibility = "hidden"
            taskInput.value = capitalize(rmvExtraSpaces(taskInput.value))
            taskInput.disabled = true;
            taskInput.id = "task-input-"+newValue
            taskBox.id = "Task-"+newValue
            yesedit.id = "check-of-"+newValue
            yesedit.setAttribute("onclick","yesEdit('"+newValue+"')")
            noedit.id = "times-of-"+newValue
            noedit.setAttribute("onclick","noEdit('"+newValue+"')")
            pen.id = "pen-of-"+newValue
            pen.style.padding = "10px"
            pen.setAttribute("onclick","editTaskName('"+newValue+"')")
            delTask.id = "delete-"+newValue
            delTask.setAttribute("onclick", "deleteTask('"+newValue+"')")
            arrayRemove(name)
            activeTasks.push(newValue)
        }
        else if(newValue == oldValue){
            noEdit(name)
        }
        else if(activeTasks.includes(newValue)){
            alert("There is already a task existing with the name "+capitalize(rmvExtraSpaces(taskInput.value))+".\nYou can't add more Tasks with a same name")
            noEdit(name)
        }
    }
    else{
        noEdit(name)
    }

    // Editing ends
    beingEdited = {
        name: "",
        oldValue: ""
    }
}
function noEdit(name){
    var taskInput = id("task-input-"+name)
    taskInput.value = beingEdited.oldValue
    taskInput.disabled = true;
    id("pen-of-"+name).style.display = "inline"
    id("check-of-"+name).style.visibility = "hidden"
    id("times-of-"+name).style.visibility = "hidden"
    beingEdited = {
        name: "",
        oldValue: ""
    }
}

function deleteTask(name){
    var capitalizedName = id("task-input-"+name).value
    var input = id("alert-input")
    customAlert(`Delete Task <i onclick='closeAlert()' class='fas fa-window-close'></i>`,"Enter the name of your task to successfully delete it\nType: <b>"+capitalizedName+"</b>","Delete Task","rmvContainer('"+capitalizedName+"','"+name+"')")
    input.addEventListener("keydown",function(e){
        if(e.keyCode == 13){
            rmvContainer(capitalizedName,name)
        }
    })
    
}
function rmvContainer(caps,name){
    if(alertName == "Delete Task"){
        if(capitalize(id("alert-input").value) == caps){
            var container = id("Task-"+name)
            id("active-todos").removeChild(container)
            arrayRemove(name)
            closeAlert()
        }
        else{
            alert("Please try again!")
        }
    }
    
}

newTask("Example Task");  // Adding Example Task