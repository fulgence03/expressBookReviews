const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
// Filter the users array for any user with the same username
let userswithsameusername = users.filter((user) => {
    return user.username === username;
});
// Return true if any user with the same username is found, otherwise false
if (userswithsameusername.length > 0) {
    return false;
} else {
    return true;
}}

const authenticatedUser = (username,password)=>{ //returns boolean
 let validusers = users.filter((user)=>{
    return user.username===username && user.password===password;
 })
 if(validusers.length>0){
    return true;
 } else {
    return false;
 }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username=req.body.username;
  let password=req.body.password;
  if(!username || !password){
    return res.status(404).json({ message: "Error logging in" });
  }
     if(authenticatedUser(username, password)){
              // Generate JWT access token
              let accessToken = jwt.sign({
                data: password
            }, 'access', { expiresIn: 60 * 60 });
    
            // Store access token and username in session
            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).send("User successfully logged in");
        } else {
            return res.status(208).json({ message: "Invalid Login. Check username and password" });
        }
  }
);

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let review=req.query.review;
  let isbn=req.params.isbn;
  let username=req.session.authorization.username;
  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
}else {
  books[isbn].reviews[username]=review;
  res.status(200).json({ 
    message: "Review updated successfully",
    reviews: books[isbn].reviews
});
}
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn=req.params.isbn;
    let username=req.session.authorization.username;
    if (!username) {
        return res.status(401).json({ message: "User not logged in" });
    }else {
      delete books[isbn].reviews[username];
      res.status(200).json({ 
        message: "Review deleted successfully",
        reviews: books[isbn].reviews
    });
    }});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
