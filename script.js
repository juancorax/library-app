class Book {
  constructor(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
  }
}

class Library {
  #myLibrary = [];

  currentBook = null;
  currentBookRow = null;

  addBook(newBook) {
    this.#myLibrary.push(newBook);
  }

  updateTableDisplay() {
    const table = document.querySelector("table");
    const tableBody = table.querySelector("tbody");

    if (tableBody.children.length === 0) {
      table.style.display = "none";
    } else {
      table.style.display = "table";
    }
  }

  displayBook(book) {
    const tableBody = document.querySelector("tbody");

    const tableRow = tableBody.insertRow();
    tableRow.setAttribute("data-index", this.#myLibrary.length - 1);

    for (const key in book) {
      if (book.hasOwnProperty(key)) {
        const cell = tableRow.insertCell();
        cell.textContent = book[key];
      }
    }

    const changeStatusCell = tableRow.insertCell();
    const showStatusFormButton = document.createElement("button");
    showStatusFormButton.textContent = "Change Status";

    showStatusFormButton.addEventListener("click", () => {
      this.currentBook = book;
      this.currentBookRow = tableRow;

      const status = document.getElementById("newStatus");
      status.value = tableRow.cells[3].textContent;

      statusForm.showModal();
    });

    changeStatusCell.appendChild(showStatusFormButton);

    const removeBookCell = tableRow.insertCell();

    const removeBookButton = document.createElement("button");
    removeBookButton.textContent = "Remove";

    removeBookButton.addEventListener("click", () => {
      const rowIndex = Number(tableRow.dataset.index);

      this.#myLibrary.splice(rowIndex, 1);
      tableBody.removeChild(tableRow);

      if (rowIndex !== this.#myLibrary.length) {
        const rows = tableBody.rows;

        for (let i = rowIndex; i < rows.length; i++) {
          rows[i].dataset.index = String(i);
        }
      }

      this.updateTableDisplay();
    });

    removeBookCell.appendChild(removeBookButton);
  }

  displayAllBooks() {
    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";

    this.#myLibrary.forEach(this.displayBook);
    this.updateTableDisplay();
  }
}

const form = document.getElementById("form");
const showFormButton = document.getElementById("showFormButton");
const closeFormButton = document.getElementById("closeFormButton");
const addBookButton = document.getElementById("addBookButton");

const statusForm = document.getElementById("statusForm");
const closeStatusFormButton = document.getElementById("closeStatusFormButton");
const changeStatusButton = document.getElementById("changeStatusButton");

showFormButton.addEventListener("click", () => {
  form.showModal();
});

closeFormButton.addEventListener("click", (event) => {
  event.preventDefault();

  form.close();
});

addBookButton.addEventListener("click", (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const pages = document.getElementById("pages").value;
  const status = document.getElementById("status").value;

  if (!title || !author || isNaN(pages) || pages <= 0) {
    alert(`
      - Title and Author must not be empty
      - Pages must be a positive number
    `);
    return;
  }

  const newBook = new Book(title, author, Number(pages), status);
  library.addBook(newBook);

  library.displayBook(newBook);
  library.updateTableDisplay();

  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("pages").value = "";
  document.getElementById("status").value = "To Be Read";

  form.close();
});

closeStatusFormButton.addEventListener("click", (event) => {
  event.preventDefault();

  statusForm.close();
});

changeStatusButton.addEventListener("click", (event) => {
  event.preventDefault();

  const status = document.getElementById("newStatus").value;

  if (library.currentBook && library.currentBookRow) {
    library.currentBook.status = status;
    library.currentBookRow.cells[3].textContent = status;
  }

  statusForm.close();
});

const library = new Library();
library.displayAllBooks();
