const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");

const public_users = express.Router();


// Get all books
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});


// Get book by ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {

    const isbn = req.params.isbn;

    try {

        const response = await axios.get('http://localhost:5000/');
        const allBooks = response.data;

        if (allBooks[isbn]) {
            return res.status(200).json(allBooks[isbn]);
        }

        return res.status(404).json({
            message: "Book not found"
        });

    } catch (error) {

        return res.status(500).json({
            message: "Error retrieving book by ISBN"
        });

    }

});


// Get books by author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {

    const author = req.params.author;

    try {

        const response = await axios.get('http://localhost:5000/');
        const allBooks = response.data;

        const filteredBooks = Object.values(allBooks).filter(
            (book) => book.author === author
        );

        return res.status(200).json(filteredBooks);

    } catch (error) {

        return res.status(500).json({
            message: "Error retrieving books by author"
        });

    }

});


// Get books by title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {

    const title = req.params.title;

    try {

        const response = await axios.get('http://localhost:5000/');
        const allBooks = response.data;

        const filteredBooks = Object.values(allBooks).filter(
            (book) => book.title === title
        );

        return res.status(200).json(filteredBooks);

    } catch (error) {

        return res.status(500).json({
            message: "Error retrieving books by title"
        });

    }

});


// Get book reviews
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }

    return res.status(404).json({
        message: "Book not found"
    });

});


module.exports.general = public_users;