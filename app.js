const express = require('express');
const users = require('./routes/user');
const articles = require('./routes/articles');
const categories = require('./routes/articleCategory');
const gifs = require("./routes/gifs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/v1', users);
app.use('/api/v1', articles);
app.use('/api/v1', categories);
app.use('/api/v1', gifs);

module.exports = app;