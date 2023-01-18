const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function(){
    const submitBook = document.getElementById("inputBook");

    submitBook.addEventListener("submit", function(event){
        event.preventDefault();
        addBook();
    })

    if(isStorageExist()){
        loadDataFromStorage();
    }
})

function addBook(){
    const titleBook = document.getElementById("inputBookTitle").value;
    const authBook = document.getElementById("inputBookAuthor").value;
    const yearBook = document.getElementById("inputBookYear").value;

    const bookID = generateID();
    const bookObject = generateBookObject(bookID, titleBook, authBook, yearBook, false);

    books.push(bookObject);

    checkCompleteBook(bookObject.id)

    console.log(books);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateID() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete){
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

document.addEventListener(RENDER_EVENT, function(){
    const uncompleteBook = document.getElementById("incompleteBookshelfList");
    uncompleteBook.innerHTML = "";

    const completeBook = document.getElementById("completeBookshelfList");
    completeBook.innerHTML = "";

    for(bookItem of books){
        const bookElement = showBook(bookItem);

        if(bookItem.isComplete == false){
            uncompleteBook.append(bookElement);
        } else {
            completeBook.append(bookElement);
        }
    }
})

function showBook(bookObject){
    const textContainer = document.createElement("div");
    textContainer.classList.add("textBook");

    const textTitle = document.createElement("h4");
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement("p");
    textAuthor.innerHTML = "Penulis :"+"<br>"+"<b>"+bookObject.author+"</b>";
    textAuthor.classList.add("author");

    const textYear = document.createElement("p");
    textYear.innerHTML = "Tahun :"+"<br>"+"<b>"+bookObject.year+"</b>";

    textContainer.append(textTitle, textAuthor, textYear);

    const buttonContainer = document.createElement("div")
    buttonContainer.classList.add("action");

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(textContainer, buttonContainer);
    container.setAttribute("id", bookObject.id);

    if(bookObject.isComplete){
        const uncompleteButton = document.createElement("button");
        uncompleteButton.innerText = "Belum Selesai"
        uncompleteButton.classList.add("green");
        uncompleteButton.addEventListener("click", function(){
            addBookToUncomplete(bookObject.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Hapus";
        deleteButton.classList.add("red");
        deleteButton.addEventListener("click", function(){
            deleteBook(bookObject.id);
        });

        buttonContainer.append(uncompleteButton, deleteButton);
    } else {
        const completeButton = document.createElement("button");
        completeButton.innerText = "Selesai"
        completeButton.classList.add("green");
        completeButton.addEventListener("click", function(){
            addBookToComplete(bookObject.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Hapus";
        deleteButton.classList.add("red");
        deleteButton.addEventListener("click", function(){
            deleteBook(bookObject.id);
        });

        buttonContainer.append(completeButton, deleteButton);
    }

    return container;

}

function checkCompleteBook(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    const checkboxComplete = document.getElementById("inputBookIsComplete");

    if(checkboxComplete.checked == false){
        bookTarget.isComplete = false;
    } else {
        bookTarget.isComplete = true;
    }
}

function addBookToComplete(bookId) {
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for(bookItem of books){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null
}

function addBookToUncomplete(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function deleteBook(bookId) {
    if(confirm("Apakah anda yakin untuk menghapus buku?") == true){
        const bookTarget = findBookIndex(bookId);
        if(bookTarget === -1) return;
        books.splice(bookTarget, 1);
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId){
    for(index in books){
        if(books[index].id === bookId){
            return index;
        }
    }
    return -1
}

function searchBook(){
    const bookItem = document.querySelectorAll('.book_item');
    for(let i = 0; i < bookItem.length; i++){
        bookItem[i].setAttribute("style", 'display:flex');
    }

    const titleBook = document.getElementById("searchBookTitle").value.toUpperCase();

    for(let i = 0; i < books.length; i++){ 
        if(books[i].title.toUpperCase() !== titleBook){
            document.getElementById(books[i].id).setAttribute("style", "display:none");
        }
    }
}Math.random().toString(16).slice(2)

document.getElementById("searchSubmit").addEventListener("click", function(event){
    event.preventDefault();
    searchBook();
});

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOK_SHELF";

function isStorageExist(){
    if(typeof(storage) === undefined){
        alert("Browser anda tidak mendukung local Storage");
        return false
    }
    return true
}

function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if(data !== null){
        for(book of data){
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}