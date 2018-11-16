//A todo list with ability to add, update, and delete 
const socket = io();


const sendTodoFunc = () => {
    // the todo obj below should match whatever you schema expects so you can persist to DB
    const todo = {
      content: $('#content').val()
    }
    // below sends the todo object to the socket route
    socket.emit('new-todo', todo);
  
    // then do ajax request to send to db
  }
  const renderNewTodo = (todo) => {
	$('#content').append(
		`<p>todo.text</p>`
	);
}
socket.on('emit-todo', (data) => renderNewTodo(data))
  // listen for socket to send data to you
  socket.on('return-todo', (data) => {
    renderNewTodo(data);
  });


$(function () {
    const state = {
        todo: [],
    };

    const render = function () {
        $('#content').empty();
        runToDoQuery();
    }

    /**
     * 
     * appends a todo to the page with an ID, a checkbox, and a delete button
     * @param {Object} outputElement object rendered
     * @param {Schema}todo todo object properties
     * @param {Object}_id assigns property to unique item id
     * 
     */

    const renderToDo = function (outputElement, todo, _id) {
        const output = $(outputElement);

        const toDoListElement = $('<div id = "todoID">').addClass('toDo');

        const label = $('<label id = "checkboxcheck">').addClass('check-marker');
        const checkbox = $('<input type="checkbox">')
            .attr('checked', todo.todoStatus)
            .toggleClass('completed')
            .data('id', todo._id);

        label.append(checkbox);
        label.append('<i class= "fas fa-times-circle checked">');
        label.append('<i class= "far fa-times-circle unchecked">');

        toDoListElement.append(
            label,
      
            $('<span>').text(todo.text).addClass('list-text'),
      
          );    

        const elem = $('<textarea.readonly>').text(todo.todoItem).addClass('textDisplay');

        const elem2 = $('<button id = "options"class = "deletetodo"><i class="fas fa-ellipsis-h"></i></button>')
            .addClass('delete')
            .attr('data-id', todo._id)
            .append('<i>')
        console.log(elem);
        toDoListElement.append(label, elem, elem2)
        output.append(toDoListElement);

        const checked = localStorage.getItem("checkboxValue");
        $(".check-marker").attr("checked", checked);
        var checkboxValues = JSON.parse(localStorage.getItem('checkboxValues')) || {};
        var $checkboxes = $("#checkboxcheck :checkbox");

        $checkboxes.on("change", function () {
            $checkboxes.each(function () {
                checkboxValues[this.id] = this.checked;
            });
            localStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));
        });

        $.each(checkboxValues, function (key, value) {
            $("#" + key).prop('checked', value);
        });
        socket.emit('new-todo', dataObj)
    }

    $('.check-marker').on('click', () => {
        const checked = $(this).attr('checked');
        const id = $(this).attr('id');

        const todo = {
            id: id,
            completed: checked
        }
        $.ajax({ method: 'PUT', url: '/api/todoLog', data: todo })
    })
    /**
     * 
     * renders all to do items in list
     * @param {Object} outputElement object rendered
     * @param {Schema}todo todo object properties
     * 
     */

    const renderToDos = function (outputElement, todo) {
        const output = $(outputElement);
        output.empty();
        todo.forEach((todo) => renderToDo(outputElement, todo));
    }

    /**
     * 
     * GET route to retrieve todo model from database
     * 
     */

    const runToDoQuery = function (S) {
        // const getData = {
        //     todoID: _id,
        //     todoItem: state.todo,
        //     todoStatus: false
        // }
        // $.ajax({
        //     url: '/api/todoLog',
        //     method: 'GET',
        //     data: getData
        // })  .then(function (todo) {
        //     state.todo = todo
        //     renderToDos('#content', todo);
        // });
        $.ajax({ url: "/api/todoLog", method: "GET" })
            .then(function (todo) {
                state.todo = todo
                renderToDos('#content', todo);
            });
    }
    socket.on('emit-todo', function (data) {
        console.log(data);
    })
    /**
     * submits input field when enter key is pressed
     * @param {Attribute} event when the enter keys is pressed
     * 
     */

    var input = document.getElementById("toDoInput");

    input.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            document.getElementById("enterData").click();
            console.log("we clicked enter")
        }
    });

    /**
     * when the submit action is performed, hide greeting, hide new todo button, and submit contents of input field. Posts new item to database.
     * @param {Attribute} event on click
     * 
     */

    $('.submit').on('click', function (event) {
        event.preventDefault();
        $('.todogreeting').addClass('hide');
        $('.newtodo').addClass('hide');
        const newToDo = {
            todoItem: $('#toDoInput').val().trim(),
            todoStatus: false,
        };
        for (let key in newToDo) {
            if (newToDo[key] === '') {
                alert('Please Enter Something To Do!');
                return;
            }
        }


        $.ajax({
            url: '/api/todoLog',
            method: 'POST',
            data: newToDo
        }).then(
            function (data) {
                if (data.success) {

                    console.log('data', data)
                    $('#content').val('');
                    $('#content').focus();

                    render();
                } else {

                    alert('There was a problem with your submission. Please check your entry and try again.');
                }
            });

    })

    /**
      * 
      * Update route
      * 
      */

    // $('body').on('click', '.check-marker', function (event) {
    //     event.preventDefault();
    //     const thisId = $(this).data('id');
    //     console.log($(this).data());
    //     const completed = event.target.checked;


    //     const toDoUpdate = state.todo[Number(thisId)];

    //     const toDoUpdate = {
    //         todoStatus: completed,
    //     };

    //     if (completed === true) {
    //         $('.toDo').addClass('line')
    //     } else {
    //         $('.toDo').removeClass('line')
    //     };

    //     $.ajax({
    //         url: `/api/todoLog/${thisId}`,
    //         method: 'PUT',
    //         data: toDoUpdate
    //     })
    //         .then(function (data) {
    //             if (data.success) {
    //                 render();
    //             } else {

    //                 alert('There was a problem with your submission. Please check your entry and try again.');
    //             }
    //         });
    // })

    /**
     * 
     * When delete button is pressed, remove item with specific id from database
     * 
     */

    $('body').on('click', '.delete', function (event) {
        const todoID = $(this).attr('data-id');

        console.log(state.todo[Number(todoID)])
        $.ajax({
            url: `/api/todoLog/${todoID}`,
            method: 'DELETE'
        })
            .then(function (data) {
                console.log(data.success);

                if (data.success) {
                    render();
                }
                else {

                    alert('There was a problem with your submission. Please check your entry and try again.');
                }
            });
    });

    render();
});