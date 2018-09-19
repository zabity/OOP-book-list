/*Tasks here:
I
  1. set up Book constructor
    -will take 3 parameters: title, author, isbn from inputs
  2. set up UI constructor
    -will contain bunch of utility functions
  3. define addBookToList function in UI.prototype
    -will contain <tr> maker with 4 <td> for title, author, isbn and X(delete)
  4. listen for event in our book-form for submit
    -get values from inputs
    -instantiate new Book with propper data from inputs
    -instantiate new UI to make use of it's functions
    -ui.addBookToList();
    -ui.clearFields();
II
  5. set validation
    -if inputs empty show error
    -if ok addBookToList and show success
  6. define UI.prototype.showAlert()
    -it accepts two parameters (message, className)
    -class should change for propper styling
    -inserts div with alert into the DOM
    -it disappears after 3 sec
III
  7. set up book deletion
    -set up delegation for the list with function(e)
    -it has to instantiate new UI to use the function, also show alert
    -define UI.prototype.deleteBook function


*/



//-------------------------
// BOOK CONSTRUCTOR
function Book(title, author, isbn){
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}

//------------------------
// UI CONSTRUCTOR
function UI(){}     //everything will be in the prototype

UI.prototype.addBookToList = function(book){
  const list = document.getElementById('book-list');
  
  //create tr element
  const row = document.createElement('tr');
  //insert cols
  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
  `

  list.appendChild(row);
}

//show alert
UI.prototype.showAlert = function(message, className){
  //create div
  const div = document.createElement('div');
  //add classes
  div.className = `alert ${className}`;
  //add text
  div.appendChild(document.createTextNode(message));
  //get parent
  const container = document.querySelector('.container');
  const form = document.querySelector('#book-form');
  //insert alert
  container.insertBefore(div, form);

  //make it disappear after 3 sec
  setTimeout(function(){
    document.querySelector('.alert').remove();
  }, 3000);
}

//delete book
UI.prototype.deleteBook = function(target){
  if (target.className === 'delete'){
    target.parentElement.parentElement.remove();
  }
}

//clear fields
UI.prototype.clearFields = function(){
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
};


//----------------------------------------
// LOCAL STORAGE CONSTRUCTOR
function Memory(){}

//create array from local storage
Memory.prototype.getArrayFromLS = function(){
  let books;
  if(localStorage.getItem('books') === null){
    books = [];
  } else {
    books = JSON.parse(localStorage.getItem('books'));
  }

  return books;
}
//store book in LS
Memory.prototype.store = function(book){
  let books = this.getArrayFromLS();
  
  books.push(book);

  localStorage.setItem('books', JSON.stringify(books));
}
//unstore book from LS
Memory.prototype.unstore = function(target){
  let books = memory.getArrayFromLS();
  books.forEach(function(book,index){
    if(target.parentElement.previousElementSibling.textContent === book.isbn){
      books.splice(index, 1);
    }
  });
  localStorage.setItem('books', JSON.stringify(books));
}

//get books from LS and put them in the DOM
Memory.prototype.loadFromLS = function(){
  let books = this.getArrayFromLS();
  
  books.forEach(function(book){
    const ui = new UI();
    ui.addBookToList(book);
  })
}
//instantiate new Memory
const memory = new Memory();

//----------------------------------------------
// EVENT LISTENERS
//event listener for DOM load
document.addEventListener('DOMContentLoaded', memory.loadFromLS());
//event listener for add book
document.getElementById('book-form').addEventListener('submit', function(e){
  //get form values
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

  //Istantiate book
  const book = new Book(title,author,isbn);

  //Instantaite UI
  const ui = new UI();

  //Instantiate Memory
  

  if(title==='' || author === '' || isbn === ''){
    //error alert
    ui.showAlert('Give me inputs!', 'error');
  } else {
    //add book to list
    ui.addBookToList(book);
    //store in LS
    memory.store(book);
    //show success
    ui.showAlert('Book added.', 'success');
    //clear fields
    ui.clearFields();
  }
  e.preventDefault();
});

//event listener for delete
document.getElementById('book-list').addEventListener('click', function(e){
  //instantiate UI
  const ui = new UI();

  ui.deleteBook(e.target);
  //remove from LS
  memory.unstore(e.target);

  //show message
  ui.showAlert('Book removed.','success');

  e.preventDefault();
})




