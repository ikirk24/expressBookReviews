const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const userExists = (username) => {
    //Check to see 
    let userswithsamename = users.filter((user) => user.username === username);
    
    if (userswithsamename.length > 0 ) {
        return true;
    } else { 
        return false;
    }
}
public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password; 

  if (username && password) {

    if (!userExists(username)) {
        users.push({
            "username": username,
            "password": password
        })
       return res.status(200).json({message: "User " + username + " successfully registered"})
    } else { 
        return res.status(403).json({message: "User already exists!"})
    }
  } else {
    return res.status(403).json({messsage: "User failed to register"})

  }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, 4, null));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  res.send(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
 let author = req.params.author;
 let bookKeys = Object.values(books);
 let matchedAuthor =  bookKeys.filter(key => key.author === author)
 return res.send(matchedAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    let title = req.params.title;
    let bookKeys = Object.values(books);
    let matchedTitle = bookKeys.filter(key => key.title === title);
    return res.send(matchedTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn; 
  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
