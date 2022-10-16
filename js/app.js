window.onload = function () {
  getCategories();
  allTasks();
  getDefaultTodos()
};

// General Functions

function getITem(key) {
  return JSON.parse(localStorage.getItem(key));
}

function setITem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function delITem(key) {
  localStorage.removeItem(key);
}

function getId(id) {
  return document.getElementById(id);
}

function queryS(id) {
  return document.querySelector(id);
}

function querySA(id) {
  return document.querySelectorAll(id);
}

function noHyphen(str) {
  let st = str.replaceAll("--", "");
  return st;
}

function noSpace(str) {
  let strn = str.replaceAll(" ", "");
  return strn;
}

function counter(key) {
  return Array.from(JSON.parse(localStorage.getItem(key))).length;
}

function message(message) {
  alert(message);
}


// ****CATEGORIES****

// Add category

function AddCategory() {
  const cName = noSpace(noHyphen(getId("category-name").value.toUpperCase()));
  if (cName.length == 0 || cName.length > 16) {
    message("min 1 max 16 character!");
  } else {
    const cList = getITem("toDos") || [];

    if (cList.includes(cName)) {
      alert("This category is already registered!");
      getId("category-name").focus();
    } else {
      const newList = [cName, ...cList];
      setITem("toDos", newList);
      setITem(cName, []);
      getId("category-name").value = "";
      getId("category-name").focus();
      getCategories();
    }
  }
}
getId("category-add").addEventListener("click", () => {
  AddCategory();
});

// add category with enter
getId("category-name").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    AddCategory();
  }
});

// get categories
function getCategories() {
  const addLinks = getId("addCategory");
  const cList = getITem("toDos") || [];
  addLinks.innerHTML = "";
  for (let i = 0; i < cList.length; i++) {
    let cName = cList[i];
    let count = counter(cName);
    addLinks.innerHTML += `
      <li  class="categoryItem">
      <i onclick='deleteCategory("${i}")'  class="fa-solid fa-xmark"></i>
      <div class="category-link" id="${i}"  onclick="sortItem('${cName}')"  class="task">${cName} <span class="tasks">${count}</span></div>
     
    </li> `;
  }
}
getCategories()

// Delete category
function deleteCategory(id) {
  const warnng = confirm("Do you want to delete?");
  if (warnng) {
    const cList = getITem("toDos");
    const deleted = cList[id];
    cList.splice(id, 1);
    setITem("toDos", cList);
    delITem(deleted);
    getCategories();
    allTasks();
    getId("add-list").innerText = "";
    getId("catgry-name").value = "";
    getId("task-name").innerText = "";
    getId("plus-add-item").classList.add("v-none");
    !cList.length ? delITem("toDos") : "";
  }
  window.location.reload();
}

// ****LISTS****

// Add list
function addList() {
  const cName = getId("catgry-name").value;
  if (cName == "") {
    alert("category name not found!");
    $("#add-item").modal("hide");
  }
  const todoList = getITem(cName) || [];
  const itemName = getId("item-name").value;
  if (!itemName || itemName.replaceAll(" ", "") == "") {
    alert("text not found!");
    return;
  }
  const importance = getId("importance").value;
  let icolor;
  const checkbox = document.querySelectorAll(".check");
  checkbox.forEach((check) => {
    check.checked ? (icolor = check.value) : null;
  });
  const todo = {
    itemName: itemName,
    importance: importance,
    completed: false,
    color: icolor,
  };
  todoList.unshift(todo);
  setITem(cName, todoList);
  const todoListh = getITem(cName);
  getId("item-name").value = "";
  getId("item-name").focus();
  cName ? sortItem(cName) : "";
  getId("add-ok").classList.remove("visible");
  getId("add-ok").innerText = "Added";
  setTimeout(function () {
    getId("add-ok").innerText = "";
    getId("add-ok").classList.add("visible");
  }, 2000);
  getCategories();
}
//? keydown Event Handler
getId("item-name").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addList();
  }
});

// get task item list

function sortItem(cName) {
  let list = getITem(cName) || [];
  console.log(cName, "l,st");
  getId("catgry-name").value = cName;
  getId("plus-add-item").classList.remove("v-none");
  getId("task-name").innerText = cName;
  list = colorsGroup(list)

  getId("add-list").innerHTML = "";
  getId("add-list-done").innerHTML = "";
  let itemList;
  const todoList = getITem(cName) || [];
  list.forEach((item) => {
    const itemName = todoList[item].itemName;
    const importance = todoList[item].importance;
    const completed = todoList[item].completed;
    let colors = ["color-1", "color-1", "color-2", "color-3", "color-4"];
    const color = colors[todoList[item].color];
    let importan = "";
    importance == "important"
      ? (importan = 'important')
      : (importan = "");
    // select main list done?
    completed ? itemList = getId("add-list-done") : itemList = getId("add-list");
    itemList.innerHTML += ` <li id="${item}" class="list-group-item  ${importan}">
      <div class="left-items">
        <div  class="todo-indicator ${color}"></div>
        <div  class="widget-heading ${completed ? 'line-through' : null}">${itemName}</div>
      </div>
      <div class="left-items">
        <input
          type="checkbox"
          id="3"
          onclick="changeImportant('${item}--${cName}')"
          class="task-check imp"  ${importance == 'important' ? `checked` : ""}
          title="important ?"/>
        <input
          type="checkbox"
          id="3"
          onclick="completeTask('${item}--${cName}')"
          class="task-check cmpl"  ${completed ? `checked` : ""}
       title="compledet ?" />
        <i onclick='deleteList("${item}--${cName}")'  class="fa fa-trash"></i>
      </div>
      </li>
                  `;
  });

  getCategories();
  allTasks();
}

// colors group
function colorsGroup(list) {
  let colors1 = list.reduce(
    (acc, item, i) =>
      item.color == 1 && item.completed == true ? [...acc, i] : [...acc],
    []
  );
  let colors1_c = list.reduce(
    (acc, item, i) =>
      item.color == 1 && item.completed == false ? [...acc, i] : [...acc],
    []
  );
  let colors2 = list.reduce(
    (acc, item, i) =>
      item.color == 2 && item.completed == true ? [...acc, i] : [...acc],
    []
  );
  let colors2_c = list.reduce(
    (acc, item, i) =>
      item.color == 2 && item.completed == false ? [...acc, i] : [...acc],
    []
  );
  let colors3 = list.reduce(
    (acc, item, i) =>
      item.color == 3 && item.completed == true ? [...acc, i] : [...acc],
    []
  );
  let colors3_c = list.reduce(
    (acc, item, i) =>
      item.color == 3 && item.completed == false ? [...acc, i] : [...acc],
    []
  );
  let noColors = list.reduce(
    (acc, item, i) =>
      item.color != 1 &&
        item.color != 2 &&
        item.color != 3 &&
        item.completed == true
        ? [...acc, i]
        : [...acc],
    []
  );
  let noColors_c = list.reduce(
    (acc, item, i) =>
      item.color != 1 &&
        item.color != 2 &&
        item.color != 3 &&
        item.completed == false
        ? [...acc, i]
        : [...acc],
    []
  );
  list = [
    ...colors1_c,
    ...colors2_c,
    ...colors3_c,
    ...noColors_c,
    ...colors1,
    ...colors2,
    ...colors3,
    ...noColors,
  ];
  return list
}

// delete list item
function deleteList(item) {
  let ok = confirm("Do you want to delete?");
  if (ok) {
    const pieces = item.split("--", 2);
    let todo = getITem(pieces[1]);
    let count = todo.length;
    todo.splice(pieces[0], 1);
    setITem(pieces[1], todo);
    sortItem(pieces[1]);
    count == 1
      ? (getId(
        "add-list"
      ).innerHTML = `<h2 style="margin:auto">list ${pieces[1]} is empty</h2>`)
      : null;
    allTasks();
    getCategories();
  }
}

// completed task
function completeTask(item) {
  const pieces = item.split("--", 2);
  let todo = getITem(pieces[1]);
  let last = todo[pieces[0]];
  todo[pieces[0]].completed
    ? (last.completed = false)
    : (last.completed = true);
  todo.splice(pieces[0], 1, last);
  setITem(pieces[1], todo);
  sortItem(pieces[1]);
}

// change important task
function changeImportant(item) {
  const pieces = item.split("--", 2);
  let todo = getITem(pieces[1]);
  let last = todo[pieces[0]];
  todo[pieces[0]].importance
    ? (last.importance = "")
    : (last.importance = "important");
  todo.splice(pieces[0], 1, last);
  setITem(pieces[1], todo);
  sortItem(pieces[1]);
}

// All tasks number
function allTasks() {
  let todos = getITem("toDos") || [];
  let count = 0;
  todos.forEach((todo) => {
    count += getITem(todo).length;
  });
  getId("task").innerHTML = `<strong>${count}</strong>`;
}



// save json formating
function saveJson() {
  let saveObj = [];
  let todos = getITem("toDos") || [];
  let count = 0;
  todos.forEach((todo) => {
    let todoValue = getITem(todo);
    let todoPack = [];
    todoPack = [todo, ...todoValue];
    saveObj.unshift(todoPack);
  });

  // file setting
  const text = JSON.stringify(saveObj);
  const name = "toDo.json";
  const type = "text/plain";

  // create file
  const a = document.createElement("a");
  const file = new Blob([text], {
    type: type,
  });
  a.href = URL.createObjectURL(file);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// upload json data modal
function getUploadJson() {
  $("#json-upload").modal("show");
  getId("json-upload").focus();
}


// get files for upload json data
let myFiles = getId("myFile")

function tik() {
  getId("myFile").click()
}

myFiles.addEventListener("change", function (e) {
  let filee = e.target.files[0];
  let filem = new FileReader();
  filem.onload = function () {
    console.log(typeof JSON.parse(filem.result));
    upLoadJson(JSON.parse(filem.result))
  }
  filem.readAsText(filee)
})

// upload json data 
async function upLoadJson(data) {
  await data.forEach((items) => {
    let [, ...lists] = items; console.log(lists);
    let oldLists = getITem(items[0]) || [];
    let newLists = [...oldLists, ...lists];
    setITem(items[0], newLists);
    let newTasks;
    let OldTasks = getITem("toDos") || [];
    if (!OldTasks.includes(items[0])) {
      newTasks = [...OldTasks, items[0]];
      setITem("toDos", newTasks);
    }
  });
  window.location.reload()
}

// Add default todo 
function getDefaultTodos() {
  if (!getITem("toDos")) {
    let question = confirm("Upload sample tasks ?")
    if (question === true) {
      //one
      setITem("toDos", ["SHOPPING"]);
      let firstTodos = [
        ["Milk", "important", true, 1],
        ["Butter", "", false, 2],
        ["Magazine", "important", false, 1],
        ["Bred", "", true, 1],
        ["Ice", "important", false, 1],
        ["Cream", "important", false, 2],
        ["Jam", "important", false, 2],
      ];
      firstTodos.forEach((ftd) => {
        const [ToDo, important, booleans, color] = ftd;
        const firstTodo = {
          itemName: ToDo,
          importance: important,
          completed: booleans,
          color: color,
        };
        let projects = getITem("SHOPPING") || [];
        let firstTodos = [firstTodo, ...projects];
        setITem("SHOPPING", firstTodos);
      });

      // two
      let Categories = getITem("toDos");
      let newCategoies = ["BIRDTHDAY", ...Categories];
      setITem("toDos", newCategoies);
      firstTodos = [
        ["Dinner reservation", "important", true, 1],
        ["Gifts", "", false, 2],
        ["Music Band", "important", false, 1],
        ["Dry cleaner", "important", false, 1],
        ["Haircut", "important", false, 2],
      ];
      firstTodos.forEach((ftd) => {
        const [ToDo, important, booleans, color] = ftd;
        const firstTodo = {
          itemName: ToDo,
          importance: important,
          completed: booleans,
          color: color,
        };
        let projects = getITem("BIRDTHDAY") || [];
        let firstTodos = [firstTodo, ...projects];
        setITem("BIRDTHDAY", firstTodos);
      });

      //three
      Categories = getITem("toDos");
      newCategoies = ["DAILY", ...Categories];
      setITem("toDos", newCategoies);
      firstTodos = [
        ["Call mom", "important", true, 1],
        ["Pay bills", "", false, 2],
        ["Get doctor appointment", "important", false, 1],
        ["Go to parent meeting", "", true, 1],
        ["Passport check", "important", false, 1],
        ["Veterinary for dog", "important", false, 2],
        ["Mediaciton", "important", false, 2],
        ["Work js", "important", true, 2],
      ];
      firstTodos.forEach((ftd) => {
        const [ToDo, important, booleans, color] = ftd;
        const firstTodo = {
          itemName: ToDo,
          importance: important,
          completed: booleans,
          color: color,
        };
        let projects = getITem("DAILY") || [];
        let firstTodos = [firstTodo, ...projects];
        setITem("DAILY", firstTodos);
      });
        window.location.reload();
    }

  }
}

//   modal show setting
$(".modal").on("shown.bs.modal", function () {
  $(this).find("[autofocus]").focus();
});




// sidebar menu slide
document.getElementById("mobile-check").addEventListener("click", (e) => {
  if (e.target.checked == true) {
    e.target.parentElement.parentElement.classList.add("mobile-active")
  } else {
    e.target.parentElement.parentElement.classList.remove("mobile-active")
  }
})