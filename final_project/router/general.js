const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    const allBooks = await new Promise((resolve) => {
       setTimeout(()=> resolve(books)
    , 300 )
    })
    res.json(allBooks)
  } catch (err) {
    res.status(404).json({error: err.message })
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  
  try {
   const booksByID = await new Promise((resolve) => { 
    
    setTimeout(() => resolve(books[isbn]), 300) 

   })
    res.json(booksByID)
   
} 

    

     catch(err) {
        
        res.status(404).json({error: err.message })
    }
    }
)
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
 let author = req.params.author;
 let bookKeys = Object.values(books);
 let matchedAuthor =  bookKeys.filter(key => key.author === author)

 try {
    const booksByAuthor = await new Promise((resolve) => {
        setTimeout(() => resolve(matchedAuthor), 300)
    })
    res.json(booksByAuthor);
 } catch(err){
    res.status(404).json({error: err.message })

 }
;
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
    let title = req.params.title;
    let bookKeys = Object.values(books);
    let matchedTitle = bookKeys.filter(key => key.title === title);
    try {
        const booksByTitle = await new Promise((resolve) => {
            setTimeout(()=> resolve(matchedTitle), 300)
        })
        res.json(booksByTitle)
    } catch (err) {
    res.status(404).json({error: err.message })
        
    }
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn; 

  return res.send(books[isbn].reviews)
    
});

module.exports.general = public_users;
