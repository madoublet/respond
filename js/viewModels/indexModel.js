// models the index page
var indexModel = {
    
    init:function(){
        ko.applyBindings(indexModel);  // apply bindings
    },
    
    login:function(o, e){
        var email = $('#email').val();
        var password = $('#password').val();

        message.showMessage('progress', 'Login...');

        $.ajax({
          url: './api/user/login',
          type: 'POST',
          data: {email: email, password: password},
          success: function(data){
            window.location = 'pages'; // redirect to pages
          },
          error: function(data){
            message.showMessage('error', 'Access denied');
          }
        });

        return false;
    }
    
}

indexModel.init();
