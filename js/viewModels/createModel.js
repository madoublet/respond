// models the create page
var createModel = {
    
    init:function(){
        
        $('#name').keyup(function(){
    		var keyed = $(this).val().toLowerCase().replace(/[^a-zA-Z 0-9]+/g,'').replace(/\s/g, '');
			keyed = keyed.substring(0,25);
			$('#tempUrl').removeClass('temp');
			$('#tempUrl').html(keyed);
			$('#friendlyId').val(keyed);
		});
        
        ko.applyBindings(createModel);  // apply bindings
    },
    
    create:function(o, e){
        var friendlyId = $('#friendlyId').val();
        var name = $('#name').val();
        var email = $('#email').val();
        var password = $('#password').val();
        var retype = $('#retype').val();
        var passcode = $('#passcode').val();
        
        if(name=='' || friendlyId=='' || email=='' || password=='' || retype==''){
			message.showMessage('error', 'All fields are required.');
			return;
		}
		
		if(password!=retype){
			message.showMessage('error', 'The password and retype fields must match.');
			return;
		}

        message.showMessage('progress', 'Creating site...');

        $.ajax({
          url: './api/site/create',
          type: 'POST',
          data: {friendlyId: friendlyId, name: name, email: email, password: password, passcode: passcode},
          success: function(data){
            message.showMessage('success', 'Site created successfully');
            
            $('#create-form').hide();
			$('#create-confirmation').show();
		
			// update site link
			href = $('#siteLink').html();
			href = href.replace('{friendlyId}', friendlyId);
			$('#siteLink').html(href);
			$('#siteLink').attr('href', href);
          },
          statusCode: {
            401: function() {  // UNAUTHORIZED
                message.showMessage('error', 'The passcode is invalid ');
            },
            409: function() {  // CONFLICT
                message.showMessage('error', 'The email you provided is already used in the system');
            }
          },
          error: function(data){}
        });

        return false;
    }
    
}

createModel.init();
