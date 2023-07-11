import { getTodos, editTodo, deleteTodo } from "/src/scripts/requests.js";

window.changeChecked = changeChecked;
window.editFunction = editFunction;
window.deleteFunction = deleteFunction;

let allData;
const pageTodoCount = 4;
const mainContainer = document.getElementById("mainContainer"),
  modal = document.getElementById("modal"),
  modalTodoTitle = document.getElementById("modal__todoTitle"),
  modalTodoDate = document.getElementById("modal__todoDate"),
  modalDeleteBtn = document.getElementById("modal__deleteBtn"),
  modalCancelBtn = document.getElementById("modal__cancelBtn");

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
const pageNum = +params.page ?? 1;
const isReload = params.reloaddata ?? "false";
let pageCounts = 1;
if (isReload == "true") fetchTodos();
else {
  allData = JSON.parse(localStorage.getItem("todos"));
  showPage();
}

function showPage() {
  pageCounts = Math.ceil(allData.length / pageTodoCount);
  if (pageNum > pageCounts) window.location.replace("/src/pages/notFound.html");
  else {
    render(
      allData.slice((pageNum - 1) * pageTodoCount, pageNum * pageTodoCount)
    );
  }
}

function render(inPageData) {
  createPagination();
  const todosContainer = document.getElementById("todosContainer");
  todosContainer.innerHTML = "";
  inPageData.forEach((item) => {
    const firstDiv = document.createElement("div");
    firstDiv.className =
      "bg-[#008080] h-24 p-3 rounded flex flex-col justify-between w-full md:w-1/2";
    const secondDiv = document.createElement("div");
    secondDiv.className = "flex justify-between";
    const thirdDiv = document.createElement("div");
    thirdDiv.className = "flex w-2/3 gap-3";
    let showingDate;
    if (+item.dueDate) {
      const newDate = new Date(+item.dueDate);
      showingDate = `${newDate.getFullYear()}-${newDate.getMonth() + 1
        }-${newDate.getDate()}`;
    } else showingDate = item.dueDate;
    const todoStatus = item.checked ? " checked" : "";
    thirdDiv.innerHTML = `<input type="checkbox" name="" id="" onclick="changeChecked(event,${item.id})"${todoStatus}/><p>${item.title}</p><p>${showingDate}</p>`;
    secondDiv.append(thirdDiv);
    const fourthDiv = document.createElement("div");
    fourthDiv.innerHTML = `<i class="bi bi-pencil-square text-2xl hover:text-teal-200 hover:cursor-pointer" onclick="editFunction(${item.id})"></i><i class="bi bi-trash text-2xl hover:text-teal-200 hover:cursor-pointer" onclick="deleteFunction(${item.id})"></i>`;
    secondDiv.append(fourthDiv);
    firstDiv.append(secondDiv);
    const descElem = document.createElement("p");
    descElem.innerText = item.description;
    firstDiv.append(descElem);
    todosContainer.append(firstDiv);
  });
}

function fetchTodos() {
  getTodos().then((res) => {
    if (res) {
      allData = res.sort((a, b) => a.dueDate - b.dueDate);
      localStorage.setItem("todos", JSON.stringify(allData));
      showPage();
    }
  });
}

function createPagination() {
  const previousPageNum = pageNum > 1 ? pageNum - 1 : 1;
  const nextPageNum = pageNum < pageCounts ? pageNum + 1 : pageCounts;
  const paginationUL = document.getElementById("pagination_ul");
  paginationUL.innerHTML = "";
  const previousLI = document.createElement("li");
  previousLI.innerHTML = `<a href="src/pages/todos.html?page=${previousPageNum}" class="bg-[#e94560] border border-gray-300 text-white hover:bg-gray-100 ml-0 rounded-l-lg leading-tight py-2 px-3 dark:border-[#008080] dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>`;
  paginationUL.append(previousLI);
  for (let i = 1; i <= pageCounts; i++) {
    const newLI = document.createElement("li");
    const textColor = i === pageNum ? "teal-200" : "white";
    newLI.innerHTML = `<a href="/src/pages/todos.html?page=${i}" class="text-${textColor} bg-[#e94560] border border-gray-300 hover:bg-gray-100 leading-tight py-2 px-3 dark:border-[#008080] dark:hover:bg-gray-700 dark:hover:text-white">${i}</a>`;
    paginationUL.append(newLI);
  }
  const nextLI = document.createElement("li");
  nextLI.innerHTML = `<a href="/src/pages/todos.html?page=${nextPageNum}" class="bg-[#e94560] border border-gray-300 text-white hover:bg-gray-100 rounded-r-lg leading-tight py-2 px-3 dark:border-[#008080] dark:hover:bg-gray-700 dark:hover:text-white">Next</a>`;
  paginationUL.append(nextLI);
}

function changeChecked(event, selectedID) {
  editTodo({ checked: event.target.checked }, selectedID).then((res) => {
    if (!res) {
      alert("Operation failed! Try again!");
    }
    window.location.replace(`/src/pages/todos.html?page=${pageNum}&reloaddata=true`);
  });
}

function editFunction(selectedID) {
  window.location.replace(`/src/pages/index.html?id=${selectedID}`);
}

function deleteFunction(selectedID, todoTitle, todoDate) {
  mainContainer.style.filter = "blur(8px)";
  modalTodoTitle.innerText = todoTitle;
  let showingDate;
  if (+todoDate) {
    const newDate = new Date(+todoDate);
    showingDate = `${newDate.getFullYear()}-${newDate.getMonth() + 1
      }-${newDate.getDate()}`;
  } else showingDate = todoDate;
  modalTodoDate.innerText = showingDate;
  modal.classList.remove("hidden");
  modalDeleteBtn.addEventListener("click", () => performDelete(selectedID));
  modalCancelBtn.addEventListener("click", fadeModal);
}

function fadeModal() {
  mainContainer.style.filter = "none";
  modal.classList.add("hidden");
}

function performDelete(forDeleteID) {
  deleteTodo(forDeleteID).then((res) =>
    window.location.replace(`/src/pages/todos.html?page=${pageNum}&reloaddata=true`)
  );
}
