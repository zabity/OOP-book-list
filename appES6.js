//app.js converted to ES6 + local storage

class Book{
  constructor(title,author,isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI{
  addBookToList(book){
    const list = document.getElementById('book-list');
  
    //create tr element
    const row = document.createElement('tr');
    //insert cols
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.isbn}</td>
      <td><a href="#" class="delete">X</a></td>
      `;

  list.appendChild(row);
  }

  showAlert(message, className){
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

  deleteBook(target){
    if (target.className === 'delete'){
      target.parentElement.parentElement.remove();
    }
  }

  clearFields(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// LOCAL STORAGE CLASS
class Store{

  static getBooks(){
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static displayBooks(){
    const books = Store.getBooks();
    books.forEach(function(book){
      const ui = new UI;
      ui.addBookToList(book);
    })
  }

  static addBook(book){
    const books = Store.getBooks();

    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn){
    const books = Store.getBooks();
    //use something that is unique
    //e.g. the isbn

    books.forEach(function(book, index){
      if(book.isbn === isbn){
        books.splice(index, 1);
      }
    })

    localStorage.setItem('books',JSON.stringify(books));
  }
}



// EVENT LISTENERS

//DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

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

  if(title==='' || author === '' || isbn === ''){
    //error alert
    ui.showAlert('Give me inputs!', 'error');
  } else {
    //add book to list
    ui.addBookToList(book);
    Store.addBook(book);

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

  //delete book
  ui.deleteBook(e.target);

  //remove from LS
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //show message
  ui.showAlert('Book removed.','success');

  e.preventDefault();
})