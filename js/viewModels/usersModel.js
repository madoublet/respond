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
    	
                    usersModel.usersLoading(false);

				}

			}
		});

	},
    
    showAddDialog:function(o, e){ // shows a dialog to add a page
    
        $('#addEditDialog').data('mode', 'add');
    	$('#addEditDialog h3').html('Add User');
		$('#addEditDialog .primary-button').text('Add User');
        
        $('#firstName').val('');
        $('#lastName').val('');
        $('#role').val('Admin');
        $('#email').val('');
        $('#password').val('');
        $('#retype').val('');
        
		$('#addEditDialog').modal('show');

		return false;
	},
    
    showEditDialog:function(o, e){ // shows a dialog to add a page
    
        $('#addEditDialog').data('mode', 'edit');
        $('#addEditDialog h3').html('Edit User');
		$('#addEditDialog .primary-button').text('Update User');
        
        usersModel.toBeEdited = o;
        
        $('#firstName').val(o.firstName());
        $('#lastName').val(o.lastName());
        $('#role').val(o.role());
        $('#email').val(o.email());
        $('#password').val('temppassword');
        $('#retype').val('temppassword');

		$('#addEditDialog').modal('show');

		return false;
	},
    
    addEditUser: function(o, e){
        
        var dialog = $('#addEditDialog');
        
        var firstName = jQuery.trim($('#firstName').val());
        var lastName = jQuery.trim($('#lastName').val());
        var role = $('#role').val();
        var email = jQuery.trim($('#email').val());
        var password = jQuery.trim($('#password').val());
        var retype = jQuery.trim($('#retype').val());
        
        if(firstName=='' || lastName=='' || email=='' || password==''){
            message.showMessage('error', 'All fields are required');
            return;
        }
        
        if(password != retype){
            message.showMessage('progress', 'The password must match the retype field');
            return;
        }
           
        if(dialog.data('mode')=='add'){ // add
        
            message.showMessage('progress', 'Adding user..');

            $.ajax({
              url: 'api/user/add',
              type: 'POST',
              data: {firstName: firstName, lastName: lastName, role: role, email:email, password:password},
			  dataType: 'json',
              success: function(data){
    
                var user = User.create(data);
              	
              	usersModel.users.push(user);
    
                message.showMessage('success', 'User was added successfully');
                
                $('#addEditDialog').modal('hide');
              }
            });
            
        }
        else{ // edit
            var userUniqId = usersModel.toBeEdited.userUniqId();
       
            message.showMessage('progress', 'Updating user..');

            $.ajax({
              url: 'api/user/' + userUniqId,
              type: 'POST',
              data: {firstName: firstName, lastName: lastName, role: role, email:email, password:password},
              success: function(data){
    
                // update the model
                usersModel.toBeEdited.firstName(firstName);
                usersModel.toBeEdited.lastName(lastName);
                usersModel.toBeEdited.role(role);
                usersModel.toBeEdited.email(email);
                usersModel.toBeEdited.email('temppassword');
                
                message.showMessage('success', 'The user was updated successfully');
         
                $('#addEditDialog').modal('hide');
              }
            });
            
            
        }
        
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
        
        $.ajax({
          url: 'api/user/'+userUniqId,
          type: 'DELETE',
          data: {},
          success: function(data){
            
            usersModel.users.remove(usersModel.toBeRemoved);
              
            message.showMessage('success', 'The user was removed successfully');
    	    $('#deleteDialog').modal('hide');
          }
        });
        
    }
}

usersModel.init();
