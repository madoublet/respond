/*
	Handles the login for Respond CMS
*/
var respond = respond || {};

respond.Login = function(config){

	this.el = config.el;
	
	var context = this.el;
	
	// hide errors
	$(this.el).find('.alert-success').hide();
	$(this.el).find('.alert-danger').hide();
	
	var returnUrl = pageModel.getQueryString('r');
	
	$(this.el).find('button[type=submit]').on('click', function(){
		
		var email = $(context).find('.email').val();
		var password = $(context).find('.password').val();
		var site = $('body').attr('data-sitefriendlyid');
		
		// reset errors
		$(context).find('.alert-success').hide();
		$(context).find('.alert-danger').hide();
		
		$.ajax({
			url: pageModel.apiEndpoint + 'api/user/login',
			type: 'POST',
			data: {email: email, password: password, site: site},
			success: function(data){
			
				$(context).find('.alert-success').show();
			
				if(returnUrl != ''){
					window.location = returnUrl; // redirect to pages
				}
				
			},
			error: function(xhr, errorText, thrownError){
				$(context).find('.alert-danger').show();
			}
        });
        
        return false;
		
	});
	
}