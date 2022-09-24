window.onload = function () {
  // BU FONKSİYONLAR SAYFADAKİ TÜM İŞLEMLER BİTTİKTEN SONRA ÇALIŞMASI GEREKİR
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

function AddCategory(){
  const cName = noSpace(noHyphen(getId("category-name").value.toUpperCase()));
  if ( cName.length == 0 ||  cName.length > 14) {
    message("min 1 max 14 character!");
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
}
getId("category-add").addEventListener("click", () => {
    AddCategory()
});

  // add category with enter
  getId("category-name").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      AddCategory()
  }
  })
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
    getId("task-name").innerText = "";
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
  // todoListh.forEach((item) => {});
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
 let allList =0; // bu 0 olursa kategoriye her tıklamada önce liste temizlenir ve listeye o kategorinin listesi eklenir 1 ise tüm kategorileri listelemek için liste sıfırlanmaz arka arkaya tüm kategorilerin listesi eklenir
function sortItem(cName) {
  let list = getITem(cName) || [];  // li listesini aldık
  getId("ctgry-name").value = cName; // task eklemek için kategori adını formdaki yerine yazdırdık
  getId("add-task").classList.remove("d-none");
  getId("plus-add-item").classList.remove("d-none");
  getId("task-name").innerText = cName;
  //colors groups   hem renkleri hemde o renkteki tamamlanmış görevleri ayrı ayrı grupladık ve hepsinin indeksini sıraladıkki aşağıda o index sırasıyla lokalden çağıracağız
  let colors1 = list.reduce((acc,item,i) =>
    item.color == 1 && item.completed == true ? [...acc,i] : [...acc] 
     
,[])  ; 
  let colors1_c = list.reduce((acc,item,i) =>
    item.color == 1 && item.completed == false ? [...acc,i] : [...acc] 
     
,[]) 
  let colors2 = list.reduce((acc,item,i) =>
    (item.color == 2 && item.completed == true) ? [...acc,i] : [...acc] 
     
,[])
  let colors2_c = list.reduce((acc,item,i) =>
    item.color == 2 && item.completed == false ? [...acc,i] : [...acc] 
     
,[])
  let colors3 = list.reduce((acc,item,i) =>
    item.color == 3 && item.completed == true ? [...acc,i] : [...acc] 
     
,[])
  let colors3_c = list.reduce((acc,item,i) =>
    item.color == 3 && item.completed == false ? [...acc,i] : [...acc] 
     
,[])
  let noColors = list.reduce((acc,item,i) =>
    item.color != 1 &&  item.color != 2 &&  item.color != 3 && item.completed == true ? [...acc,i] : [...acc] 
     // radio hiç seçilmemiş te olabilir  boş olarak ta seçilmiş olabilir hem boş hem color-4 kalıyor geriye ikisinide böyle seçmiş olduk
,[])
  let noColors_c = list.reduce((acc,item,i) =>
  item.color != 1 &&  item.color != 2 &&   item.color != 3 && item.completed == false ? [...acc,i] : [...acc] 
     
,[])

  list = [...(colors1_c.reverse()), ...(colors2_c.reverse()), ...(colors3_c.reverse()), ...(noColors_c.reverse()),...(colors1.reverse()), ...(colors2.reverse()), ...(colors3.reverse()), ...(noColors.reverse())] ;
  let itemList = getId("add-list"); console.log(allList);
  !allList ?  itemList.innerHTML = "" : itemList.innerHTML += `<div  style="margin:auto;font-weight:700 ;font-size:25px">${cName}</div>`;   // allList 0 ise tüm listeler getirilmeyecek her kategori tıklandığında liste sıfırlanacak  1 olursa liste sıfırlanmadan arka arkaya tüm kategorilerin listesi eklenecek
  const todoList = getITem(cName) || [];
  list.forEach((item) => { // yukarıda index sırasını aldık şimdi, o sıraya göre localden indexlerle alıyoruz renkler hem yapılmaış hem yapılmışlar olarak gruplandı
    const itemName = todoList[item].itemName;
    const importance = todoList[item].importance;
    const completed = todoList[item].completed;
    let colors = ["color-1", "color-1", "color-2", "color-3", "color-4"];
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
                        <div onclick="completeTask('${item}--${cName}')" class="widget-heading ${
                          completed ? "line-through" : null
                        }">  ${importan}  ${itemName}
                        </div>
                        </div>
                    <div class="widget-content-right">
                        <input type="checkbox" id='${item}' onclick="changeImportant('${item}--${cName}')" class="task-check">
                        
                        <button onclick='deleteList("${item}--${cName}")'  class="border-0 btn-transition btn btn-outline-danger">
                        <i class="fa fa-trash"></i>
                        
                        </button>
                    </div>
                    </div>
                    </div>
                </li> 
                `;
  });
  
  getCategories();
  allTasks();
  // getId("task").innerHTML = `<strong>${todoList.length}</strong>`; // o anki listelenen  task toplam 
  if (!list.length) {
    getId("add-list").innerHTML = `<h2 style="margin:auto">list ${cName} is empty</h2>`;
  }
}

// delete list item

function deleteList(item) {
  let ok = confirm("are you sure you want to delete?")
  if(ok){
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
    // getId("task").innerHTML = `<strong>${count - 1}</strong>`;
    allTasks();
    getCategories();
  }
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
// change importan task

function changeImportant(item) {
  const pieces = item.split("--", 2);
  let todo = getITem(pieces[1]);
  let last = todo[pieces[0]];
  todo[pieces[0]].importance
    ? (last.importance = "")
    : last.importance = "important"; // completed true ise false , false ise true olacak
  todo.splice(pieces[0], 1, last);
  setITem(pieces[1], todo);
  sortItem(pieces[1]);
}

// All tasks number
function allTasks() {
  let todos = getITem("toDos") || [];
  let count = 0;

  todos.forEach((todo) => {
    count += getITem(todo).length; //  Object.keys(getITem(todo)).length;
  });

  getId("task").innerHTML = `<strong>${count}</strong>`;
}

// alltasks list
async function  allTasksList() {
  allList = 1;
 
  getId("add-list").innerHTML="";
  let todos = getITem("toDos") || [];
  todos.forEach((todo) => {
    sortItem(todo)
  });
  getId("add-task").classList.add("d-none");  //todo ekeme butonlarını kaldıralım
  getId("plus-add-item").classList.add("d-none");
  getId("ctgry-name").value = "";
  allList = 0; // listelerken liste aıfırlama normal hale getiriliyor

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

