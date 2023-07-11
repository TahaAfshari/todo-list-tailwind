import { addTodo, editTodo, getTodo } from "/src/scripts/requests.js";

const formSubmitBtn = document.getElementById("form__submitBtn"),
  todoTitleInput = document.getElementById("grid-title"),
  todoDescriptionInput = document.getElementById("grid-description"),
  todoDateInput = document.getElementById("grid-date"),
  todoTitleError = document.getElementById("grid-title__error"),
  todoDateError = document.getElementById("grid-date__error"),
  toastSuccess = document.getElementById("toast__success"),
  toastCloseBtn = document.getElementById("toast__closeBtn"),
  toastMessage = document.getElementById("toastMessage");

formSubmitBtn.addEventListener("click", formSubmitFunc);
todoTitleInput.addEventListener("input", RemoveTitleError);
todoDateInput.addEventListener("input", RemoveDateError);
toastCloseBtn.addEventListener("click", closeToast);

//Get query parameter
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
const forEditID = params.id ?? null;
if (forEditID) {
  prepareForEdit();
}

function closeToast() {
  toastSuccess.classList.add("hidden");
  toastMessage.innerText = "The todo successfully submited!";
}

function formSubmitFunc(event) {
  event.preventDefault();
  if (!todoTitleInput.value || !todoDateInput.value) {
    if (!todoTitleInput.value) {
      todoTitleInput.classList.add("border-red-500");
      todoTitleError.classList.remove("hidden");
    }
    if (!todoDateInput.value) {
      todoDateInput.classList.add("border-red-500");
      todoDateError.classList.remove("hidden");
    }
    return;
  }
  if (forEditID) {
    updateTodo();
  } else generateTodo();
}

function RemoveTitleError() {
  if (todoTitleInput.value) {
    todoTitleInput.classList.remove("border-red-500");
    todoTitleError.classList.add("hidden");
  } else {
    todoTitleInput.classList.add("border-red-500");
    todoTitleError.classList.remove("hidden");
  }
}

function RemoveDateError() {
  if (todoDateInput.value) {
    todoDateInput.classList.remove("border-red-500");
    todoDateError.classList.add("hidden");
  } else {
    todoDateInput.classList.add("border-red-500");
    todoDateError.classList.remove("hidden");
  }
}

function generateTodo() {
  const createTime = Date.now();
  const toSubmitData = {
    title: todoTitleInput.value,
    dueDate: new Date(todoDateInput.value).getTime(),
    description: todoDescriptionInput.value,
    // id: Date.now().toString(36),
    createdAt: createTime,
    updatedAt: createTime,
    checked: false,
  };
  addTodo(toSubmitData).then((res) => {
    if (res) {
      todoTitleInput.value = "";
      todoDateInput.value = "";
      todoDescriptionInput.value = "";
      toastSuccess.classList.remove("hidden");
    } else alert("Todo insertion failed! Please try again!");
  });
}

function updateTodo() {
  const updateTime = Date.now();
  const toEditData = {
    title: todoTitleInput.value,
    dueDate: new Date(todoDateInput.value).getTime(),
    description: todoDescriptionInput.value,
    updatedAt: updateTime,
  };
  editTodo(toEditData, forEditID).then((res) => {
    if (res) {
      todoTitleInput.value = "";
      todoDateInput.value = "";
      todoDescriptionInput.value = "";
      formSubmitBtn.innerText = "Submit";
      toastSuccess.classList.remove("hidden");
    } else alert("Todo update failed! Please try again!");
  });
}

function prepareForEdit() {
  getTodo(forEditID).then((res) => {
    if (res.length > 0) {
      todoTitleInput.value = res[0].title;
      todoDescriptionInput.value = res[0].description;
      let showingDate;
      if (+res[0].dueDate) {
        const newDate = new Date(res[0].dueDate);
        showingDate = `${newDate.getFullYear()}-${newDate.getMonth() + 1
          }-${newDate.getDate()}`;
      } else showingDate = res[0].dueDate;
      console.log(res[0].dueDate);
      console.log(showingDate);
      todoDateInput.value = showingDate;
      formSubmitBtn.innerText = "Save";
      toastMessage.innerText = "The todo successfully updated!";
    } else window.location.replace("/src/pages/notFound.html");
  });
}
