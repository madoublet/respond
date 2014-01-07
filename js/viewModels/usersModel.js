// models the users page
var usersModel = {

	users: ko.observableArray([]),
	usersLoading: ko.observable(true),

	toBeRemoved: null,
    toBeEdited: null,

	init:function(){ // initializes the model
		usersModel.updateUsers();	

		ko.applyBindings(usersModel);  // apply bindings
	},
 
	updateUsers:function(){

		usersModel.users.removeAll();
		usersModel.usersLoading(true);

		$.ajax({
			url: 'api/user/list/all',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){

				for(x in data){

					var user = User.create(data[x]);

					usersModel.users.push(user); 
    	
				}

				usersModel.usersLoading(false);

			}
		});

	},
    
    showAddDialog:function(o, e){ // shows a dialog to add a page
    
        $('#addEditDialog').find('.edit').hide();
        $('#addEditDialog').find('.add').show();
        
        $('#firstName').val('');
        $('#lastName').val('');
        $('#role').val('Admin');
        $('#language').val('en');
        $('#email').val('');
        $('#password').val('');
        $('#retype').val('');
        
		$('#addEditDialog').modal('show');

		return false;
	},
    
    showEditDialog:function(o, e){ // shows a dialog to add a page
    
        $('#addEditDialog').find('.add').hide();
        $('#addEditDialog').find('.edit').show();
        
        usersModel.toBeEdited = o;
        
        $('#firstName').val(o.firstName());
        $('#lastName').val(o.lastName());
        $('#role').val(o.role());
        $('#language').val(o.language());
        $('#email').val(o.email());
        $('#password').val('temppassword');
        $('#retype').val('temppassword');

		$('#addEditDialog').modal('show');

		return false;
	},
    
    // adds a user
    addUser: function(o, e){
        
        var firstName = jQuery.trim($('#firstName').val());
        var lastName = jQuery.trim($('#lastName').val());
        var role = $('#role').val();
        var language = $('#language').val();
        var email = jQuery.trim($('#email').val());
        var password = jQuery.trim($('#password').val());
        var retype = jQuery.trim($('#retype').val());
        
        if(firstName=='' || lastName=='' || email=='' || password==''){
            message.showMessage('error', $('#msg-all-required').val());
            return;
        }
        
        if(password != retype){
            message.showMessage('progress', $('#msg-match').val());
            return;
        }
           
   
        message.showMessage('progress', $('#msg-adding').val());

        $.ajax({
          url: 'api/user/add',
          type: 'POST',
          data: {firstName: firstName, lastName: lastName, role: role, language: language, email: email, password: password},
		  dataType: 'json',
          success: function(data){

            var user = User.create(data);
          	
          	usersModel.users.push(user);

            message.showMessage('success', $('#msg-added').val());
            
            $('#addEditDialog').modal('hide');
          }
        });
        
    },
    
    // edits a user
    editUser: function(o, e){
        
        var firstName = jQuery.trim($('#firstName').val());
        var lastName = jQuery.trim($('#lastName').val());
        var role = $('#role').val();
        var language = $('#language').val();
        var email = jQuery.trim($('#email').val());
        var password = jQuery.trim($('#password').val());
        var retype = jQuery.trim($('#retype').val());
        
        if(firstName=='' || lastName=='' || email=='' || password==''){
            message.showMessage('error', $('#msg-all-required').val());
            return;
        }
        
        if(password != retype){
            message.showMessage('progress', $('#msg-match').val());
            return;
        }
           
    
        var userUniqId = usersModel.toBeEdited.userUniqId();
   
        message.showMessage('progress', $('#msg-updating').val());

        $.ajax({
          url: 'api/user/' + userUniqId,
          type: 'POST',
          data: {firstName: firstName, lastName: lastName, role: role, language: language, email: email, password: password},
          success: function(data){

            // update the model
            usersModel.toBeEdited.firstName(firstName);
            usersModel.toBeEdited.lastName(lastName);
            usersModel.toBeEdited.role(role);
            usersModel.toBeEdited.language(language);
            usersModel.toBeEdited.email(email);
            usersModel.toBeEdited.password('temppassword');
            
            message.showMessage('success', $('#msg-updated').val());
     
            $('#addEditDialog').modal('hide');
          }
        });    
    },

    // shows a dialog to remove a menuitem
    showRemoveDialog:function(o, e){
		usersModel.toBeRemoved = o;

		var id = o.userUniqId();
		var name = o.fullName();
        
		$('#removeName').html(name);  // show remove dialog
		$('#deleteDialog').data('id', id);
		$('#deleteDialog').modal('show');

		return false;
	},
    
    removeUser:function(o, e){
        
        var userUniqId = usersModel.toBeRemoved.userUniqId();
        
        message.showMessage('progress', $('#msg-removing').val());
        
        $.ajax({
          url: 'api/user/'+userUniqId,
          type: 'DELETE',
          data: {},
          success: function(data){
            
            usersModel.users.remove(usersModel.toBeRemoved);
              
            message.showMessage('success', $('#msg-removed').val());
    	    $('#deleteDialog').modal('hide');
          }
        });
        
    }
}

usersModel.init();
