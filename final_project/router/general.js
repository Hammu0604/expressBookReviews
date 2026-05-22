const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");

const public_users = express.Router();


// Get all books
public_users.get('/', async function (req, res) {

    try {

        return res.status(200).json({
            books
        });

    } catch (error) {

        return res.status(500).json({
            message: "Error retrieving books"
        });

    }

});


// Get book by ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

    const isbn = req.params.isbn;

    try {

        const response = await axios.get('http://localhost:5000/');

        const allBooks = response.data.books;

        if (allBooks[isbn]) {

            return res.status(200).json(allBooks[isbn]);

        } else {

            return res.status(404).json({
                message: "Book not found"
            });

        }

    } catch (error) {

        return res.status(500).json({
            message: "Error retrieving book"
        });

    }

});


// Get books by author
public_users.get('/author/:author', async function (req, res) {

    const author = req.params.author;

    try {

        const response = await axios.get('http://localhost:5000/');

        const allBooks = response.data.books;

        let filteredBooks = {};

        Object.keys(allBooks).forEach((key) => {

            if (allBooks[key].author === author) {

                filteredBooks[key] = allBooks[key];

            }

        });

        if (Object.keys(filteredBooks).length > 0) {

            return res.status(200).json(filteredBooks);

        } else {

            return res.status(404).json({
                message: "Author not found"
            });

        }

    } catch (error) {

        return res.status(500).json({
            message: "Error retrieving books by author"
        });

    }

});


// Get books by title
public_users.get('/title/:title', async function (req, res) {

    const title = req.params.title;

    try {

        const response = await axios.get('http://localhost:5000/');

        const allBooks = response.data.books;

        let filteredBooks = {};

        Object.keys(allBooks).forEach((key) => {

            if (allBooks[key].title === title) {

                filteredBooks[key] = allBooks[key];

            }

        });

        if (Object.keys(filteredBooks).length > 0) {

            return res.status(200).json(filteredBooks);

        } else {

            return res.status(404).json({
                message: "Title not found"
            });

        }

    } catch (error) {

        return res.status(500).json({
            message: "Error retrieving books by title"
        });

    }

});


// Get book reviews
public_users.get('/review/:isbn', async function (req, res) {

    const isbn = req.params.isbn;

    try {

        if (books[isbn]) {

            return res.status(200).json(books[isbn].reviews);

        } else {

            return res.status(404).json({
                message: "Book not found"
            });

        }

    } catch (error) {

        return res.status(500).json({
            message: "Error retrieving reviews"
        });

    }

});


module.exports.general = public_users;