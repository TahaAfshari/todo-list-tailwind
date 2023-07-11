const url = "https://60b77f8f17d1dc0017b8a2c4.mockapi.io/todos";

function getTodos() {
  return fetch(url)
    .then((res) => res.json())
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return [];
    });
}

function getTodo(id) {
  return fetch(`${url}?id=${id}`)
    .then((res) => res.json())
    .then((result) => {
      return result;
    })
    .catch((err) => {
      return [];
    });
}

function addTodo(data) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((result) => {
      return true;
    })
    .catch((err) => {
      return false;
    });
}

function editTodo(data, id) {
  return fetch(`${url}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((result) => {
      return true;
    })
    .catch((err) => {
      return false;
    });
}

function deleteTodo(id) {
  return fetch(`${url}/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) {
        throw "Error";
      }
    })
    .then((result) => {
      return true;
    })
    .catch((err) => {
      return false;
    });
}

export { addTodo, getTodos, editTodo, deleteTodo, getTodo };
