const socket = io();
function render(htmlStr) {
    $('#display').append(`<p>${htmlStr}</p>`);
  }


const sendMessage = function (event) {
    event.preventDefault();
    const message = $('#message').val();
    console.log(message)
    // $.post('new-message', { message: message });
    socket.emit('new-message', { message: message, name: name, user2: user2 });
    $.ajax({
        url: '/api/messages',
        method: 'POST',
        data: {
            sender: name,
            body: message
        }
    })
        .then(function (data) {
            console.log(data)
            render('#content', data)
        })
}

const displayChat = function () {
    $.ajax({
        url: '/api/messages',
        method: 'GET',
        data: {
            sender: name,
            body: message
        }
    })
        .then(function (data) {
            let htmlstr = '';
            data.forEach(function(chats){
                htmlstr = `<p class ="${chats.sender}">${chats.sender}:${chats.body}`
            })
            render('#content', htmlstr)
        })
}

socket.on('emit-message', function (data) {
    console.log(data);
})


$('#send-msg').on('click', sendMessage);

/*-------------------Register Name------------------------*/
let name = '';
// let name = localStorage.getItem('user');
// socket.emit('new-name', { name: name });
let user2 = '';


const sendName = function (event) {
    event.preventDefault();
    name = $('#name').val();
    socket.emit('new-name', { name: name });
}

socket.on('emit-users', function (data) {
    if (name) {
        const $select = $('<select>');
        $select.append('<option>Select User</option>')
        console.log(data);
        data.forEach(name => $select.append(`<option>${name}</option>`))

        $('name-form').hide();
        $('#select-container').empty();
        $('#select-container').append($select)
    }
})


$('#send-name').on('click', sendName);


/*-----------------Start Chat--------------*/

const startChat = function (event) {
    event.preventDefault();
    //empty chat area
    user2 = $('select').find(':selected').text();
    $('#msg-form').show();
}


$('#select-container').on('change', 'select', startChat)