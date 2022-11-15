const submitBtn = document.querySelector(".submit-btn");
const groceriesContainer = document.querySelector(".groceries-container");
const groceryInput = document.getElementById("grocery-input");
const alert = document.querySelector(".alert");
const groceriesList = document.querySelector(".groceries-list");
const clearBtn = document.querySelector(".clear-btn");
// const groceries = [];

let editFlag = false;
let editElement = "";
let editId = "";

//fonction permettant d'ajouter un item à la liste
function createItem(id, value) {
  let parent = document.createElement("article");
  parent.classList.add("grocery-item");
  parent.dataset.id = id;

  parent.innerHTML = `<p class="title">${value}</p>
  <div class="buttons">
    <button type="button" class="item-delete">
        <i class="fa-solid fa-trash"></i>
    </button>
    <button type="button" class="edit-btn">
    <i class="fa-solid fa-pen-to-square"></i>
    </button></div>`;

  groceriesList.appendChild(parent);

  displayAlert("Item ajouté", "green");

  const deleteBtn = parent.querySelector(".item-delete");
  deleteBtn.addEventListener("click", deleteItem);

  const editBtn = parent.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);

  resetStates();
}

// function pour prendre des éléments dans le local storage
function getFromLocalStorage() {
  const groceries = localStorage.getItem("groceries");
  if (groceries === null) {
    return [];
  } else {
    return JSON.parse(groceries);
  }
}

// fonction pour ajouter au local storage
function addToLocalStorage(id, value) {
  const items = getFromLocalStorage();
  const obj = { id, value };
  items.push(obj);
  localStorage.setItem("groceries", JSON.stringify(items));
}

// fonction pour effacer du local storage
function removeFromLocalStorage(id) {
  const items = getFromLocalStorage();
  const filteredItems = items.filter(function (item) {
    return item.id !== id;
  });
  localStorage.setItem("groceries", JSON.stringify(filteredItems));
}

// fonction pour edit le local storage
function editLocalStorage(id, value) {
  const items = getFromLocalStorage();

  const editedItems = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("groceries", JSON.stringify(editedItems));
}

// fonction pour faire apparaitre les éléments contenus dans le local storage sur la page dès le lancement de celle-ci
function setupItems() {
  const items = getFromLocalStorage();

  if (items.length > 0) {
    items.forEach(function (item) {
      createItem(item.id, item.value);
    });

    groceriesContainer.classList.add("show-container");
  }
}

document.addEventListener("DOMContentLoaded", setupItems);

// fonction permettant de clear tous les items
function clearAll() {
  const items = document.querySelectorAll(".grocery-item");

  if (items.length > 0) {
    items.forEach(function (item) {
      groceriesList.removeChild(item);
      groceriesContainer.classList.remove("show-container");
      groceryInput.value = "";
      displayAlert("Liste effacée!", "green");
      localStorage.removeItem("groceries");
    });
  }
  resetStates();
}

clearBtn.addEventListener("click", function () {
  clearAll();
});

// fonction permettant de clear un item à la fois
function deleteItem(event) {
  event.currentTarget.parentElement.parentElement.remove();
  displayAlert("item retiré", "green");
  if (groceriesList.children.length === 0) {
    groceriesContainer.classList.remove("show-container");
  }
  removeFromLocalStorage(
    event.currentTarget.parentElement.parentElement.dataset.id
  );
  resetStates();
}

// fonction permettant d'éditer un item avec alerte pop-up orange

function editItem(event) {
  editId = event.currentTarget.parentElement.parentElement.dataset.id;
  editFlag = true;
  editElement = event.currentTarget.parentElement.parentElement.firstChild;
  submitBtn.textContent = "Edit";
  groceryInput.focus();
  groceryInput.value =
    event.currentTarget.parentElement.parentElement.firstChild.textContent;
  displayAlert("modification en cours...", "orange");
}

// fonction permettant d'afficher une alerte avec un texte
function displayAlert(text, color) {
  alert.textContent = text;
  alert.classList.add(`display-${color}-alert`);
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`display-${color}-alert`);
  }, 1000);
}

// event sur le bouton clear all
submitBtn.addEventListener("click", function (e) {
  addItem(e);
});

// fonction pour add un item
function addItem(event) {
  event.preventDefault();
  const value = groceryInput.value;

  if (!value) {
    displayAlert("! Merci d'entrer un item !", "red");
  } else if (value && !editFlag) {
    const id = new Date().getTime().toString();

    groceriesContainer.classList.add("show-container");
    createItem(id, value);
    addToLocalStorage(id, value);
    resetStates();
  } else {
    editElement.textContent = value;
    editLocalStorage(editId, value);
    displayAlert("Item modifié", "green");
    resetStates();
  }
}

// fonction reset
function resetStates() {
  groceryInput.value = "";
  editFlag = false;
  editId = "";
  submitBtn.textContent = "Ajouter";
  groceryInput.focus();
}
