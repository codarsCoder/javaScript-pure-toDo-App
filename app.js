
    window.onload = function(){
        $('#add-item').modal('show');
    }
    // Fonksiyonlar
    getCategories();
    function getITem(key) { return JSON.parse(localStorage.getItem(key))};
    function setITem(key,value) { localStorage.setItem(key,JSON.stringify(value));}
    function setITem(key,value) { localStorage.setItem(key,JSON.stringify(value));}
    function getId(id){ return document.getElementById(id)}
    function queryS(id){ return document.querySelector(id)}
    function querySA(id){ return document.querySelectorAll(id)}
    function noHyphen(str){ let st = str.replaceAll('--', '') ; return st}

    // ****CATEGORIES****

    // Add category

    getId("category-add").addEventListener("click",() => {
        
        const cName =  noHyphen(getId("category-name").value);
        const cList = getITem("toDos") || [];
        
        if(cList.includes(cName)) {
            alert("This category is already registered!")
            getId("category-name").focus();
        }else{
        const newList = [cName, ...cList];
            setITem("toDos", newList);
            getId("category-name").value="";
            getId("category-name").focus();
            console.log(getITem("toDos"));
            getCategories();
        }                  
    })

    // get categories

    function getCategories(){

        const addLinks = getId("add-links");
        const cList = getITem("toDos") || [];
        addLinks.innerHTML = "";

        cList.forEach((category,i) => {
            addLinks.innerHTML += 
            `<div class="links"><span id="${i}" oclick="deleteCategory('${i}')" class="s-link">${category}</span>
            <span class="tasks"><p>Tasks 0</p></span>
            <span   id="${i}" oclick='deleteCategory("${i}")'  class="trash "><button onclick='deleteCategory("${i}")'><i class="delete-category fa fa-trash-o" aria-hidden="true"></i></button></span>
        </div>`
            
        });
    }

    // Delete category

  
    function deleteCategory(id) {
               
        const cList = getITem("toDos");
            cList.splice(id,1);
            setITem("toDos",cList);
            getCategories()
           
    };

 
    // ****LISTS****

    // Add list

    function addList() {

        const todoList = getITem("todoList") || [];
       const itemName = getId("item-name").value
       const importance = getId("importance").value
       const cName = getId("ctgry-name").value
       let color
       const checkbox = document.querySelectorAll(".check")
       checkbox.forEach(check =>{
            check.checked ? console.log(check.value,) : null
       })
       
      
       
       

        // const todo = {
        //     name:name,
        //     todos:toDo,
        //     bol:bol
        //     }
        //     list.push(todo)


    }


























    // const allCategoty = querySA(".delete-category");

    // for(let i = 0; i < allCategoty.length; i++){
            
    // }
    




 // querySA(".delete-category").forEach((category) => {
           
    //     category.addEventListener("click", () => {
               
    //         let id =  category.getAttribute("id");
    //             const cList = getITem("toDos");
    //             cList.splice(id,1);
    //             setITem("toDos",cList);
    //             getCategories()

    //         });
    // });








// function Setup(name,toDo,bol){
//   const list = getITem("toDos") || [];
  
//   const todo = {
//     name:name,
//     todos:toDo,
//     bol:bol
//   }
//   list.push(todo)
//    setITem("toDos",list)
//   }
// function geT(name){
//    const list = getITem("toDos") || [];
//   let liste = Array.from(list)
//   console.log(liste[0].name)
//   console.log(liste[0].todos)
//   console.log(liste[0].bol)
  
// }
// Setup("ali","ödev",false)
//  geT("ali")

//     // modal auto focus
    // $('.modal').on('shown.bs.modal', function() {
    //     $(this).find('[autofocus]').focus();
    //     });       