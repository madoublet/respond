// models the forgot page
var forgotModel = {
    
    hasToken:ko.observable(false),
    token:ko.observable(),
    
    init:function(){
        
        var t = global.getQueryStringByName('t');
        
        if(t!=''){
            forgotModel.hasToken(true);
            forgotModel.token(t);
        }
        
        ko.applyBindings(forgotModel);  // apply bindings
    },
    
    forgot:function(o, e){
        var email = $('#email').val();
        
        message.showMessage('progress', 'Sending email...');

        $.ajax({
            url: './api/user/forgot',
            type: 'POST',
            data: {email: email},
            success: function(data){
                $('#email').val('');
                message.showMessage('success', 'Email sent');
            },
            error: function(data){
                message.showMessage('error', 'We could not find your email in the system');
            }
        });

    },
    
    reset:function(o, e){
        var password = $('#password').val();
        var retype = $('#retype').val();
        var token = forgotModel.token();
        
        if(password!=retype){
            message.showMessage('error', 'The password and retype must match');
            return;
        }

        message.showMessage('progress', 'Resetting password...');

        $.ajax({
          url: './api/user/reset',
          type: 'POST',
          data: {token: token, password: password},
          success: function(data){
                $('#password').val('');
                $('#reset').val('');
                message.showMessage('success', 'Password reset');
          },
          error: function(data){
                message.showMessage('error', 'Access denied');
          }
        });

        return false;
    }
    
}

forgotModel.init();
