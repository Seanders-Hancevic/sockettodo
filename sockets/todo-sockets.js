const todos = {}

module.exports = function (io) {
    io.on('connection', function (socket) {

        socket.on('new-todo', function (data) {
            console.log(data);
           todos[data.todoItem] = socket;
           io.emit('emit-todo', Object.keys(todos));
        })
      
        //Socket Routes
        socket.on('return-todo', function (data) {
            console.log(data);
            const socket1 = todos[data.todoItem];
            socket1.emit('emit-todo', data);
         
        })

    });
}