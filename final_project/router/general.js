const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username=req.body.username;
  let password=req.body.password;
   // Check if both username and password are provided
   if (username && password) {
    // Check if the user does not already exist
    if (isValid(username)) {
        // Add the new user to the users array
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
}
// Return error if username or password is missing
return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        if (books) {
            resolve(books); 
        } else {
            reject("Books not found");
        }
    });
   getBooks
        .then((books) => {
            res.send(JSON.stringify(books, null, 4)); 
        })
        .catch((err) => {
            res.status(404).send({ error: err }); 
        });
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]); 
        } else {
            reject("Book not found");
        }
    });
    getBookByISBN
        .then((book) => {
            res.send(book);
        })
        .catch((err) => {
            res.status(404).send({ error: err });
        });
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
        const searchedBooks = Object.values(books).filter((book) => book.author === author);
        if (searchedBooks.length > 0) {
            resolve(searchedBooks); 
        } else {
            reject("No books found for the specified author");
        }
    });
    getBooksByAuthor
        .then((books) => {
            res.send(books); 
        })
        .catch((err) => {
            res.status(404).send({ error: err });
        });
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
        const title = req.params.title;    
        const getBooksByTitle = new Promise((resolve, reject) => {
            const searchedBooks = Object.values(books).filter((book) => book.title === title);   
            if (searchedBooks.length > 0) {
                resolve(searchedBooks); 
            } else {
                reject("No books found for the specified title"); 
            }
        });
        getBooksByTitle
            .then((books) => {
                res.send(books); 
            })
            .catch((err) => {
                res.status(404).send({ error: err });
            });   
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn=req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
