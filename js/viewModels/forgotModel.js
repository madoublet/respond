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
        
        message.showMessage('progress', $('#msg-sending').val());

        $.ajax({
            url: 'api/user/forgot',
            type: 'POST',
            data: {email: email},
            success: function(data){
                $('#email').val('');
                message.showMessage('success', $('#msg-sent').val());
            },
            error: function(data){
                message.showMessage('error', $('#msg-email-invalid').val());
            }
        });

    },
    
    reset:function(o, e){
        var password = $('#password').val();
        var retype = $('#retype').val();
        var token = forgotModel.token();
        
        if(password!=retype){
            message.showMessage('error', $('#msg-match-error').val());
            return;
        }

        message.showMessage('progress', $('#msg-resetting').val());

        $.ajax({
          url: 'api/user/reset',
          type: 'POST',
          data: {token: token, password: password},
          success: function(data){
                $('#password').val('');
                $('#reset').val('');
                message.showMessage('success', $('#msg-reset').val());
          },
          error: function(data){
                message.showMessage('error', $('#msg-denied').val());
          }
        });

        return false;
    }
    
}

forgotModel.init();
