const login = function (event){
    event.preventDefault();
    const user = $('#login-username').val();
    
    //post request verify username and password .then()
     
    localStorage.setItem('user', user);
    window.location.href = '/landing';
  }
  
  $('#login-btn').on('click', login);