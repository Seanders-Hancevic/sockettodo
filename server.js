const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));


mongoose.connect('mongodb://localhost/toDoList', { useNewUrlParser: true});

require('./sockets/todo-sockets')(io)


require('./routes/html-routes')(app);
require('./routes/api-routes-todo')(app);

server.listen(PORT, () => {
    console.log('Server is Listening')
})