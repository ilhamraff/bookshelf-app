document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form-data-book");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

const books = [];
const RENDER_EVENT = "render-book";

function addBook() {
  const title = document.getElementById("inputTitle").value;
  const author = document.getElementById("inputAuthor").value;
  const year = parseInt(document.getElementById("inputYear").value);
  const isComplete = document.getElementById("inputIsComplete").checked;

  const generateID = generateId();
  const bookObject = generateBookObject(
    generateID,
    title,
    author,
    year,
    isComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
});

function addBookToComplete(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Author: ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun: ${bookObject.year}`;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textAuthor, textYear);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");
    undoButton.innerText = "Baca Ulang";

    undoButton.addEventListener("click", function () {
      undoBookFromComplete(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerText = "Buang Buku";

    deleteButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    container.append(undoButton, deleteButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.innerText = "Selesai Baca";

    checkButton.addEventListener("click", function () {
      addBookToComplete(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerText = "Buang Buku";

    deleteButton.addEventListener("click", function () {
      removeBookFromNotCompleted(bookObject.id);
    });

    container.append(checkButton, deleteButton);
  }

  return container;
}

function removeBookFromCompleted(bookId) {
  const bookIndex = findBookIndex(bookId);

  if (bookIndex === -1) return;

  const bookToRemove = books[bookIndex];
  showDialog();

  const confirmDeleteButton = document.getElementById("confirmDelete");
  confirmDeleteButton.onclick = function () {
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    hideDialog();
    alert(`Buku "${bookToRemove.title}" telah dihapus.`);
  };
}

function removeBookFromNotCompleted(bookId) {
  const bookIndex = findBookIndex(bookId);

  if (bookIndex === -1) return;

  const bookToRemove = books[bookIndex];
  showDialog();

  const confirmDeleteButton = document.getElementById("confirmDelete");
  confirmDeleteButton.onclick = function () {
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    hideDialog();
    alert(`Buku "${bookToRemove.title}" telah dihapus.`);
  };
}

function showDialog() {
  const dialog = document.getElementById("deleteDialog");
  dialog.style.display = "block";

  const cancelDeleteButton = document.getElementById("cancelDelete");
  cancelDeleteButton.onclick = function () {
    hideDialog();
  };
}

function hideDialog() {
  const dialog = document.getElementById("deleteDialog");
  dialog.style.display = "none";
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function undoBookFromComplete(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData;
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);

  const uncompleteBOOKList = document.getElementById("books");
  uncompleteBOOKList.innerHTML = "";

  const completeBOOKList = document.getElementById("completed-books");
  completeBOOKList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      uncompleteBOOKList.append(bookElement);
    } else {
      completeBOOKList.append(bookElement);
    }
  }
});

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF-APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
