// models the index page
var indexModel = {
    
    init:function(){
    
    	if(window.localStorage){
	    	window.localStorage['show-account-message'] = 'true';
    	}
    	
        ko.applyBindings(indexModel);  // apply bindings
    },
    
    login:function(o, e){
        var email = $('#email').val();
        var password = $('#password').val();

        message.showMessage('progress', 'Login...');

        $.ajax({
			url: 'api/user/login',
			type: 'POST',
			data: {email: email, password: password},
			success: function(data){
				window.location = data['start']; // redirect to pages
			},
			error: function(xhr, errorText, thrownError){
				console.log(xhr.responseText);
				message.showMessage('error', xhr.responseText);
			}
        });

        return false;
    }
    
}

indexModel.init();
