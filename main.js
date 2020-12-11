const root = document.getElementById("root");
const input = document.getElementById("todo-input");
const todolist = document.getElementById("todo-list");
let todoCount; //= document.getElementById("todo-count");
let footer; //= document.getElementById("todo_footer");
let classify //= document.getElementsByClassName("todo-app__view-buttons")[0];
let completed //= document.getElementById("completed");
let active //= document.getElementById("active");
let all //= document.getElementById("all");
let prev
let todos = [];
let cptodo = [];
let id = 0;

function addAtodo(todo){
	const itemNode = document.createElement("LI");
	const div = document.createElement("DIV");
	const checkbox = document.createElement("INPUT");
	const label = document.createElement("label");
	const h1 =document.createElement("h1");
	const x = document.createElement("img");
	itemNode.classList.add("todo-app__item");
	div.classList.add("todo-app__checkbox");
	checkbox.setAttribute("id", todo.id);
	checkbox.setAttribute("type", "checkbox");
	checkbox.addEventListener("click", function(){
		// show clear complete button, update 
		if(cptodo.length == 0){
			const btn = document.createElement("button");
			btn.setAttribute("id", "clear_completed");
			btn.innerHTML = "Clear completed";
			footer.lastElementChild.appendChild(btn);
		} 
		h1.style["textDecoration"] = todo.complete ? "none" : "line-through";
		h1.style["opacity"] = todo.complete ? 1 : 0.5;
		todo.complete ^= 1;
		cptodo = todos.filter(e => e.complete);
		if(prev == completed){
			todolist.innerHTML = "";
			for(var i in cptodo)
				todolist.appendChild(cptodo[i].node);
		}
		else if(prev == active){
			todolist.innerHTML = "";
			var tmp = todos.filter(e => !e.complete);
			for(var i in tmp)
				todolist.appendChild(tmp[i].node);
		}
		if(cptodo.length == 0){
			const clear_completed = document.getElementById("clear_completed");
			clear_completed.parentNode.removeChild(clear_completed);
		}
		updatecount();
	});
	label.setAttribute("for" , todo.id);
	h1.classList.add("todo-app__item-detail");
	h1.innerText = todo.name;
	x.setAttribute("src", "./img/x.png");
	x.setAttribute("id", todo.id);
	x.classList.add("todo-app__item-x");
	div.appendChild(checkbox);
	div.appendChild(label);
	itemNode.appendChild(div);
	itemNode.appendChild(h1);
	itemNode.appendChild(x);
	//todolist.appendChild(itemNode);
	todo.node = itemNode;
	return todo;
}
input.addEventListener("keyup", function (event) {
	if (event.keyCode === 13 && input.value) {
		if(todos.length == 0){
			const foot = `<footer class="todo-app__footer" id="todo_footer">
							<div id="todo-count" class="todo-app__total"></div>
							<ul class="todo-app__view-buttons">
								<button id="all" style="border: 1px solid grey;">All</button>
								<button id="active">Active</button>
								<button id="completed">Completed</button>
							</ul>
							<div class="todo-app__clean"></div>
						</footer>
							`;
			const position = "beforeend";
			root.insertAdjacentHTML(position, foot);
			footer = document.getElementById("todo_footer");
			todoCount = document.getElementById("todo-count");
			classify = document.getElementsByClassName("todo-app__view-buttons")[0];
			completed = document.getElementById("completed");
			active = document.getElementById("active");
			all = document.getElementById("all");
			prev = all;
		}
		todo = { name: input.value,
				id: id,									
				complete: false
				} 
		todos.push(addAtodo(todo));
		if(prev == completed)
			prev.removeAttribute("style", "border");
		else
			todolist.appendChild(todo.node);
		updatecount();
		id++;
		input.value = '';
	}
});

function removetodo(x){
	for(var i in todos){
		if(todos[i].id == x.id)
		todos.splice(i, 1);
	}
	for(var i in cptodo){
		if(cptodo[i].id == x.id){
			cptodo.splice(i, 1);
			if(cptodo.length == 0){
				const clear_completed = document.getElementById("clear_completed");
				clear_completed.parentNode.removeChild(clear_completed);
			}
		}
	}
	x.parentNode.parentNode.removeChild(x.parentNode);
	if(todos.length == 0) {root.removeChild(footer); return;}
	updatecount();
}
todolist.addEventListener("click", function(e){
	if(e.target.className == "todo-app__item-x")
		removetodo(e.target);	
})
function updatecount(){
	todoCount.innerHTML = todos.filter(e => !e.complete).length + " left";
}

document.onclick = function(e){
	if(e.target.id == "clear_completed"){
		cptodo = [];
		todos = todos.filter(e => !e.complete);
		todolist.innerHTML = "";
		for(var i in todos){
			todolist.appendChild(todos[i].node);
		}
		if(todos.length == 0) root.removeChild(footer);
		else {
			e.target.parentNode.removeChild(e.target);
			if(prev == completed) {
				prev.removeAttribute("style", "border");
				all.style["border"] = "1px solid grey";
				prev = all;
			}
		}
		return;
	}
	if(e.target.id != "active" && e.target.id != "completed" && e.target.id != "all") return;
	if((e.target.id == "active" || e.target.id == "completed") && cptodo.length == 0) return;
	if(e.target == prev) return;
	
	prev.removeAttribute("style", "border");
	e.target.style["border"] = "1px solid grey";
	prev = e.target;
	
	if(e.target.id == "all"){
		todolist.innerHTML = "";
		for(var i in todos)
			todolist.appendChild(todos[i].node);
	}
	else if(e.target.id == "completed"){
		todolist.innerHTML = "";
		for(var i in cptodo)
			todolist.appendChild(cptodo[i].node);
	}
	else if(e.target.id == "active"){
		todolist.innerHTML = "";
		var tmp = todos.filter(e => !e.complete);
		for(var i in tmp)
			todolist.appendChild(tmp[i].node);
	}
}
