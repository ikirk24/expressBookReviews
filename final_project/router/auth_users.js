const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let usernameExists = users.filter((user) => user.username === username);
    if (usernameExists) {
        return true;
    } else {
        return res.status(403).json({message: "User was not found"});
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    if (isValid){
        let validUser = users.filter((user) => {
            return (user.username === username && user.password === password)
        })
        if (validUser) {
            return true;
        } else {
            return res.status(403).json({message: "The username and password do not match"}); 
        }
    }
} 

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(404).json({message: "You are missing the username or password"})
  } 

  if (authenticatedUser(username, password)){
    //Generate jwt token
    let accessToken = jwt.sign({
        data: password
        }, 'access', {expiresIn: 60 * 60})
  

    req.session.authorization = {
        accessToken, username

    } 
        return res.status(200).json({message: "User logged in successfully"})
    } else {
        return res.status(208).json({message: "Invalid login"})
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const user = req.session.authorization.username; 
  const reviews = books[isbn].reviews;
  const review = req.body.review;

   
    if (!user) {
        req.status(404).json({message: "User not logged in"})
     } 
    
        reviews[user] = { review }

        res.json({
            message: 'Review updated by ' + user, 
            review: reviews[user]
        })
     
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Delete a only the user loggin in's review

    const isbn = req.params.isbn;
    const user = req.session.authorization.username; 
    const reviews = books[isbn].reviews;
    const pastReviews = reviews
    if (!user) {
        res.status(404).json({message: "User not logged in"})
    } else {
        delete reviews[user]
        res.json({
            message: user + "'s review has been deleted",
            })
    }
})

    

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
