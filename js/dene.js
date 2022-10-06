<li id="${item}" class="list-group-item  ${importan}">
<div class="left-items">
  <div class="todo-indicator ${color}"></div>
  <div onclick="completeTask('${item}--${cName}')" class="widget-heading ${completed ? 'line-through' : null}">${itemName}</div>
</div>
<div class="left-items">
  <input
    type="checkbox"
    id="3"
    onclick="changeImportant('3--DAILY')"
    class="task-check"  ${importance == 'important' ? `checked` : ""}
  />
  <i onclick='deleteList("${item}--${cName}")'  class="fa fa-trash"></i>
</div>
</li>

` 
                      <li id="${item}" data="${completed ? 2 : 1
        }"class="list-group-item">
                      <div class="todo-indicator ${color}"></div>
                      <div class="widget-content p-0">
                      <div class="widget-content-wrapper">
                          <div class="widget-content-left mr-2">
                          </div>
                          <div class="widget-content-left">
                          <div onclick="completeTask('${item}--${cName}')" class="widget-heading ${completed ? "line-through" : null
        }">  ${importan}  ${itemName}
                          </div>
                          </div>
                      <div class="widget-content-right">
                      <label for='${item}'> <input type="checkbox" id='${item}' onclick="changeImportant('${item}--${cName}')" class="task-check"  
                          ${importance == "important" ? `checked` : ""}>
                         </label>
                          <button onclick='deleteList("${item}--${cName}")'  class="border-0 btn-transition btn btn-outline-danger">
                          <i class="fa fa-trash"></i>
                          </button>
                      </div>
                      </div>
                      </div>
                  </li> 
                  `