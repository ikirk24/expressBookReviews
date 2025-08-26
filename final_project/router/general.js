const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  //Checks if username exists
  const doesExist = (username) => {  
  let filtered_username = users.filter(user => user.usersname === username);
  if (filtered_username.length > 0) {
    return true;
  } else {
    return false; 
  }}
  if (username && password){
    if (!doesExist(username)) {
        users.push({"username": username, "password": password})
        return res.status(200).json({message: "User successfully registered"});  
        } else {
            return res.status(404).json({message: "User already exists!"})
        }

  }
  return res.status(300).json({message: "Missing username or password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  const isbn = req.params.isbn;
  return res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authors = req.params.author;
    let author = Object.keys(books).filter(key => books[key].author === authors);
    res.send(books[author]);
});
 

  

;

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titles = req.params.title;
  let title = Object.keys(books).filter(key => books[key].title === titles);
  res.send(books[title]);
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
