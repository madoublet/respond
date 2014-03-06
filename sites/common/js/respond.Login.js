/*
	Handles the login for Respond CMS
*/
var respond = respond || {};

respond.Login = function(config){

	this.el = config.el;
	
	var context = this.el;

	$(this.el).find('button[type=submit]').on('click', function(){
		
		var email = $(context).find('.email').val();
		var password = $(context).find('.password').val();
		
		/*
		
		$.ajax({
			url: pageModel.apiEndpoint + 'api/user/login',
			type: 'POST',
			data: {email: email, password: password},
			success: function(data){
				window.location = data['start']; // redirect to pages
			},
			error: function(xhr, errorText, thrownError){
				console.log(xhr.responseText);
				message.showMessage('error', $('#msg-error').val());
			}
        }); */
		
	});
	
}