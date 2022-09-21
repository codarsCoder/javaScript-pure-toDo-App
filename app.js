window.onload = function () {// BU FONKSİYONLAR SAYFADAKİ TÜM İŞLEMLER BİTTİKTEN SONRA ÇALIŞMASI GEREKİR
  getCategories();
  allTasks();
};
// Functions

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

getId("category-add").addEventListener("click", () => {
  const cName = noSpace(noHyphen(getId("category-name").value.toUpperCase()));
  if (cName.length > 14) {
    message("max 14 character!");
  } else {
    const cList = getITem("toDos") || [];

    if (cList.includes(cName)) {
      alert("This category is already registered!");
      getId("category-name").focus();
    } else {
      const newList = [cName, ...cList]; //const newList = [cName, ...cList];
      setITem("toDos", newList);
      setITem(cName, []); // aynı zamanda yeni kategori için  boş bir diziekliyoruz yoksa sayma işlemi yaparken onun karşılığını bulamadığından dolayı hata veriyor
      getId("category-name").value = "";
      getId("category-name").focus();
      getCategories();
    }
  }
});

// get categories

function getCategories() {
  const addLinks = getId("add-links");
  const cList = getITem("toDos") || []; //JSON.parse(localStorage.getItem('toDos')) // getITem('toDos') || [];
  addLinks.innerHTML = "";
  for (let i = 0; i < cList.length; i++) {
    let cName = cList[i];
    let count = counter(cName); // getITem(cName)  //  JSON.parse(localStorage.getItem(cName))

    addLinks.innerHTML += `<div class="links">
            <button id="${i}"  onclick="sortItem('${cName}')" class="s-link">${cName}</button>   
            <span class="tasks-num">${i + 1}</span>
            <span class="tasks"><p>Tasks ${count}</p></span>
            <span  class="trash "><button onclick='deleteCategory("${i}")'><i class="delete-category fas fa-trash-alt" aria-hidden="true"></i></button></span>
        </div>`;
  }
}

// Delete category

function deleteCategory(id) {
  const warnng = confirm("are you sure you want to delete?");
  if (warnng) {
    const cList = getITem("toDos");
    const deleted = cList[id];
    cList.splice(id, 1);
    setITem("toDos", cList);
    delITem(deleted);
    getCategories();
    allTasks();
    getId("add-list").innerText = "";
    getId("task-name").innerText= "";
   
  }
}

// ****LISTS****

// Add list

function addList() {
  const cName = getId("ctgry-name").value;
  if (cName == "") {
    alert("category name not found!");
    $("#add-item").modal("hide");
  }
  const todoList = getITem(cName) || [];
  const itemName = getId("item-name").value;
  if (!itemName || itemName.replaceAll(" ", "") == "") {
    alert("text not found!");
    return;
  } // tümboşluklar alındıkatan sonra boş kalıyorsa uyarı ver
  const importance = getId("importance").value;
  var icolor;
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
  todoListh.forEach((item) => {});
  getId("item-name").value = "";
  getId("item-name").focus();
  cName ?  sortItem(cName) : "";
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
  let list = getITem(cName); // li listesini aldık
  getId("add-task").classList.remove("d-none");
  getId("plus-add-item").classList.remove("d-none");
  getId("task-name").innerText = cName;
  let tek = []; // boş dizileri oluşturduk  ve daha önce completed kısmı ture  ve false olmasına göre li lere 1 ve 2 verdik
  let cift = []; // 1 yapıldı  iki yapılmadı demek   li deki data kısmına da ilgili elemanın id sini verdik id kısmında  1 yazanların dataolanları bir listeye iki olnların
  list.forEach((item, i) => {
    console.log(item.completed);
    item.completed == false ? (tek = [...tek, i]) : (cift = [...cift, i]);
  });
  let sortedList = [...tek, ...cift];
  console.log(sortedList);

  let itemList = getId("add-list");
  itemList.innerHTML = "";
 
  const todoList = getITem(cName) || [];
  sortedList.forEach((item) => {
    const itemName = todoList[item].itemName;
    const importance = todoList[item].importance;
    const completed = todoList[item].completed;
    let colors = ["color-1", "color-1", "color-2", "color-3"];
    const color = colors[todoList[item].color];
    let importan = "";
    importance == "important"
      ? (importan = '<div class="badge badge-danger ml-2">Important</div>')
      : (importan = "");
    itemList.innerHTML += ` 
                    <li id="${item}" data="${
      completed ? 2 : 1
    }" class="list-group-item">
                    <div class="todo-indicator ${color}"></div>
                    <div class="widget-content p-0">
                    <div class="widget-content-wrapper">
                        <div class="widget-content-left mr-2">
                        </div>
                        <div class="widget-content-left">
                        <div class="widget-heading ${
                          completed ? "line-through" : null
                        }"> ${itemName} ${importan} 
                        </div>
                        </div>
                    <div class="widget-content-right">
                        <input type="checkbox" id='${item}' onclick="completeTask('${item}--${cName}')" class="task-check " ${
      completed ? "checked" : null
    }>
                        
                        <button onclick='deleteList("${item}--${cName}")'  class="border-0 btn-transition btn btn-outline-danger">
                        <i class="fa fa-trash"></i>
                        
                        </button>
                    </div>
                    </div>
                    </div>
                </li> 
                `;
  });
  getId("ctgry-name").value = cName; // task eklemek için kategori adını formdaki yerine yazdırdık
  getCategories();
}

// delete list item

function deleteList(item) {
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
    : null; // listede bir eleman kalmışsa sildikten sonnra liste boşalacağından empty ekledik
  getId("task").innerHTML = `<strong>${count - 1}</strong>`;
  getCategories();
}

// complete task

function completeTask(item) {
  const pieces = item.split("--", 2);
  let todo = getITem(pieces[1]);
  let last = todo[pieces[0]];
  todo[pieces[0]].completed
    ? (last.completed = false)
    : (last.completed = true); // completed true ise false , false ise true olacak
  todo.splice(pieces[0], 1, last);
  setITem(pieces[1], todo);
  sortItem(pieces[1]);
}

// All tasks
function allTasks() {
  let todos = getITem("toDos") || [];
  let count = 0;

  todos.forEach((todo) => {
    count += getITem(todo).length; //  Object.keys(getITem(todo)).length;
  });

  getId("task").innerHTML = `<strong>${count}</strong>`;
}

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
  const file = new Blob([text], { type: type });
  a.href = URL.createObjectURL(file);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function getUploadJson() {
  $("#json-yukle").modal("show");
  $("#options").modal("hide");
}

function upLoadJson() {
  let jsons = JSON.parse(getId("addjson").value);
  jsons.forEach((items) => {
    let [, ...lists] = items;
    let oldLists = getITem(items[0]) || [];
    let newLists = [...oldLists, ...lists];
    setITem(items[0], newLists);
    let newTasks;
    let OldTasks = getITem("toDos") || []; // todos var mı getir yoksa boş dizi ver
    if (!OldTasks.includes(items[0])) {
      newTasks = [...OldTasks, items[0]];
      setITem("toDos", newTasks);
    }
  });
  getCategories();
  allTasks();
  getId("addjson").value = "";
  $("#json-yukle").modal("hide");
}

$(".modal").on("shown.bs.modal", function () {
  $(this).find("[autofocus]").focus();
});

