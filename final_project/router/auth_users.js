const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    if (username) {
        for (let user of users) {
            if (user.username === username) return false;
        }
        return true;
    }
    else return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } 
    else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send(`Customer successfully logged in`);
    }
    else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
// regd_users.put("/auth/review/:isbn", (req, res) => {
//     //Write your code here
//     let isbn = req.params.isbn;
//     let book = books[isbn];
//     let review = req.query.review;
//     let username = req.session.authorization['username']
//     book['reviews'] = {
//         ...book['review'],
//         [username]: review
//     }
//     res.status(200).send(`The review for the book with ISBN ${isbn} has been added / updated`);
// });

regd_users.put("/auth/review/:isbn", (req, res) => {
    // Extracting the ISBN from the parameters and converting it to a number
    let isbn = Number(req.params.isbn);
    let book = books[isbn];

    // Check if the book exists
    if (!book) {
        return res.status(404).send(`No book found with ISBN ${isbn}`);
    }

    let review = req.query.review;
    let username = req.session.authorization['username'];

    // Update the reviews for the book
    book['reviews'] = {
        ...book['reviews'],
        [username]: review
    };

    res.status(200).send(`The review for the book with ISBN ${isbn} has been added / updated`);
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let isbn = req.params.isbn
    let book = books[isbn];
    let username = req.session.authorization['username']

    delete book['reviews'][username]
    res.status(200).send(`Review for the ISBN ${isbn} posted by the user ${username} has been deleted`)
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
