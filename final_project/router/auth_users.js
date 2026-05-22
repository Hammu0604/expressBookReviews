const express = require('express');
const jwt = require('jsonwebtoken');

let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// Check username exists or not
const isValid = (username) => {

  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });

  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

// Check login credentials
const authenticatedUser = (username, password) => {

  let validusers = users.filter((user) => {
    return (
      user.username === username &&
      user.password === password
    );
  });

  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

// REGISTER USER
regd_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {

    if (!isValid(username)) {

      users.push({
        username: username,
        password: password
      });

      return res.status(200).json({
        message: "User successfully registered. Now you can login"
      });

    } else {

      return res.status(404).json({
        message: "User already exists!"
      });
    }
  }

  return res.status(404).json({
    message: "Unable to register user."
  });
});

// LOGIN USER
regd_users.post("/login", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {

    return res.status(404).json({
      message: "Error logging in"
    });
  }

  if (authenticatedUser(username, password)) {

    let accessToken = jwt.sign(
      {
        data: password
      },
      'access',
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).send("Customer successfully logged in.");
  }

  return res.status(208).json({
    message: "Invalid Login. Check username and password"
  });
});

// ADD OR MODIFY REVIEW
regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const review = req.query.review;

  const username = req.session.authorization.username;

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/modified successfully"
  });
});

// DELETE REVIEW
regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;

  const username = req.session.authorization.username;

  if (books[isbn].reviews[username]) {

    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: "Review deleted successfully"
    });
  }

  return res.status(404).json({
    message: "Review not found"
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;