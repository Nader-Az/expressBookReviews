const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username
  let password = req.body.password

  if(username && password && isValid(username)) {
    users.push( {
        username,
        password
    })
    res.status(200).json({message: `Customer successfully registred. You can now login`});
  }
  else {
    return res.send(`Unable to register, username is invalid / exists. Choose a different username.`)
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,5))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn]
  res.send(JSON.stringify(book,null,4));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author
  let result = {
      "booksByAuthor": []
  }
  let keys = Object.keys(books)
  for(let key of keys) {
      let book = books[key]
      if(book.author == author) {
          result['booksByAuthor'].push(book)
      }
  }
  res.send(result)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title
  let result = {
    "booksByTitle": []
  }
  let keys = Object.keys(books)
  for(let key of keys) {
      let book = books[key]
      if(book.title == title) {
          result['booksByTitle'].push(book)
      }
  }
  res.send(result)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  let review = books[isbn].reviews
  res.send(JSON.stringify(review,null,5));
});


// Async requests
public_users.get("/books", function(req,res) {
    let promise = new Promise( function(resolve,reject) {
        resolve(res.send(JSON.stringify(books, null, 4)));
    });

    promise.then( () => console.log("Book list has been sent successfully"));
});
  
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];
    let promise = new Promise( function(resolve, reject) {
        if(book) {
        resolve(res.send( JSON.stringify(book, null, 5) ));
        }
        else {
        resolve(res.send("Sorry, We couldn't find a book with this ISBN"));
        }
    });

    promise.then( () => console.log("The details of the book with the requested ISBN has been sent successfully ") );

});

public_users.get('/author/:author',function (req, res) {
    let promise = new Promise( function(resolve,reject) {
        let author = req.params.author;
        let result = {
        "booksByAuthor": []
        }
        
        let keys = Object.keys(books);

        for(let key of keys) {
          let book = books[key];
          if(book.author == author) {
              result['booksByAuthor'].push(book)
          }
        }
        
        resolve(res.send( JSON.stringify(result,null,5) ))
    });

    promise.then( () => console.log("The list of books with the requested Author has been sent successfully") )
});

public_users.get('/title/:title',function (req, res) {
    let promise = new Promise( function(resolve,reject){
        let title = req.params.title;
        
        let result = {
          "booksByTitle": []
        }
        
        let keys = Object.keys(books);

        for(let key of keys) {  
          let book = books[key]
          if(book.title == title) {
              result['booksByTitle'].push(book)
          }
        }

        resolve(res.send( JSON.stringify(result,null,5) ));
    });

    promise.then( () => console.log("Books with the requested title has been sent successfully.") )
});

module.exports.general = public_users;
