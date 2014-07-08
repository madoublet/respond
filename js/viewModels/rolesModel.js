// models the roles page
var rolesModel = {

	roles: ko.observableArray([]),
	rolesLoading: ko.observable(false),
	
    pageTypes: ko.observableArray([]),

	toBeRemoved: null,
    toBeEdited: null,

	init:function(){ // initializes the model
		rolesModel.updateRoles();
		rolesModel.updatePageTypes();	
		
		// handle checkbox clicking
		$('body').on('click', '.chk-view-all', function(){
			$('.chk-view').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-edit-all', function(){
			$('.chk-edit').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-publish-all', function(){
			$('.chk-publish').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-remove-all', function(){
			$('.chk-remove').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-create-all', function(){
			$('.chk-create').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-view', function(){
			$('.chk-view-all').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-edit', function(){
			$('.chk-edit-all').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-publish', function(){
			$('.chk-publish-all').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-remove', function(){
			$('.chk-remove-all').removeAttr('checked');
		});
		
		$('body').on('click', '.chk-create', function(){
			$('.chk-create-all').removeAttr('checked');
		});
		
		ko.applyBindings(rolesModel);  // apply bindings
	},
 
	updateRoles:function(){

		rolesModel.roles.removeAll();
		rolesModel.rolesLoading(true);

		$.ajax({
			url: 'api/role/list',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){

				for(x in data){

					var role = Role.create(data[x]);

					rolesModel.roles.push(role); 

				}

				rolesModel.rolesLoading(false);

			}
		});

	},
	
	updatePageTypes:function(){  // updates the page types arr

		rolesModel.pageTypes.removeAll();

		$.ajax({
			url: 'api/pagetype/list/all',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){

				for(x in data){

					var pageType = PageType.create(data[x]);

					rolesModel.pageTypes.push(pageType); 

				}

			}
		});

	},
    
    showAddDialog:function(o, e){ // shows a dialog to add a page
    
    	var el = $(e.target);
    
    	$('#addEditDialog').find('.edit').hide();
        $('#addEditDialog').find('.add').show();

		$('#addEditDialog').modal('show');
		
		// clear textbox
		$('#name').val('');
		
		// uncheck all the boxes
		$('#addEditDialog').find('input[type=checkbox]').removeAttr('checked');
		$('#addEditDialog').find('input[type=checkbox]').removeAttr('disabled');
		$('#custom-name').show();
		$('#default-message').hide();
		
		return false;
	},
    
    showEditDialog:function(o, e){ // shows a dialog to add a page
    
    	var el = $(e.target);
    
    	$('#addEditDialog').find('.edit').show();
        $('#addEditDialog').find('.add').hide();
    
        rolesModel.toBeEdited = o;
       
		$('#addEditDialog').modal('show');
		
		// get type, etc.
		var type = el.attr('data-type');
		
		// change view for default roles
		if(type === 'default'){
			$('#addEditDialog').find('input[type=checkbox]').attr('disabled', 'disabled');
			$('#addEditDialog').find('input[type=checkbox]').removeAttr('checked')
			$('#custom-name').hide();
			$('#update-role-btn').hide();
			$('#default-message').show();
		}
		else{
			// set name
			$('#name').val(o.name());
		
			$('#addEditDialog').find('input[type=checkbox]').removeAttr('disabled');
			$('#addEditDialog').find('input[type=checkbox]').removeAttr('checked')
			$('#custom-name').show();
			$('#update-role-btn').show();
			$('#default-message').hide();
		}
		
		// setup checkboxes
		var view = el.attr('data-view');
		var edit = el.attr('data-edit');
		var publish = el.attr('data-publish');
		var remove = el.attr('data-remove');
		var create = el.attr('data-create');
		
		// check view boxes
		if(view == 'All'){
			$('.chk-view-all').attr('checked', 'checked');
		}
		else{
			var list = view.split(',');
			
			for(x=0; x<list.length; x++){
				$('.chk-view-'+list[x]).attr('checked', 'checked');
			}
		}
		
		// check edit boxes
		if(edit == 'All'){
			$('.chk-edit-all').attr('checked', 'checked');
		}
		else{
			var list = edit.split(',');
			
			for(x=0; x<list.length; x++){
				$('.chk-edit-'+list[x]).attr('checked', 'checked');
			}
		}
		
		// check publish boxes
		if(publish == 'All'){
			$('.chk-publish-all').attr('checked', 'checked');
		}
		else{
			var list = publish.split(',');
			
			for(x=0; x<list.length; x++){
				$('.chk-publish-'+list[x]).attr('checked', 'checked');
			}
		}
		
		// check remove boxes
		if(remove == 'All'){
			$('.chk-remove-all').attr('checked', 'checked');
		}
		else{
			var list = remove.split(',');
			
			for(x=0; x<list.length; x++){
				$('.chk-remove-'+list[x]).attr('checked', 'checked');
			}
		}
		
		// check create boxes
		if(create == 'All'){
			$('.chk-create-all').attr('checked', 'checked');
		}
		else{
			var list = create.split(',');
			
			for(x=0; x<list.length; x++){
				$('.chk-create-'+list[x]).attr('checked', 'checked');
			}
		}

		return false;
	},
    
    // adds a role
    addRole: function(o, e){
        
        var name = jQuery.trim($('#name').val());
        
        if(name==''){
            message.showMessage('error', $('#msg-all-required').val());
            return;
        }
      
		// init
		var canView = '';
		var canEdit = '';
		var canPublish = '';
		var canRemove = '';
		var canCreate = '';
		
		// get view
		if($('.chk-view-all').prop('checked')){
			canView = 'All';
		}
		else{
			var checks = $('.chk-view');
			
			for(x=0; x<checks.length; x++){
				if($(checks[x]).prop('checked')){
					canView += $(checks[x]).val() + ',';
				}
			}		
		}
		
		// get publish
		if($('.chk-edit-all').prop('checked')){
			canEdit = 'All';
		}
		else{
			var checks = $('.chk-edit');
			
			for(x=0; x<checks.length; x++){
				if($(checks[x]).prop('checked')){
					canEdit += $(checks[x]).val() + ',';
				}
			}		
		}
		
		// get publish
		if($('.chk-publish-all').prop('checked')){
			canPublish = 'All';
		}
		else{
			var checks = $('.chk-publish');
			
			for(x=0; x<checks.length; x++){
				if($(checks[x]).prop('checked')){
					canPublish += $(checks[x]).val() + ',';
				}
			}		
		}
		
		// get remove
		if($('.chk-remove-all').prop('checked')){
			canRemove = 'All';
		}
		else{
			var checks = $('.chk-remove');
			
			for(x=0; x<checks.length; x++){
				if($(checks[x]).prop('checked')){
					canRemove += $(checks[x]).val() + ',';
				}
			}		
		}
		
		// get add
		if($('.chk-create-all').prop('checked')){
			canCreate = 'All';
		}
		else{
			var checks = $('.chk-create');
			
			for(x=0; x<checks.length; x++){
				if($(checks[x]).prop('checked')){
					canCreate += $(checks[x]).val() + ',';
				}
			}		
		}
		
		// remove trailing comma
		canView = canView.replace(/(^,)|(,$)/g, "");
		canEdit = canEdit.replace(/(^,)|(,$)/g, "");
		canPublish = canPublish.replace(/(^,)|(,$)/g, "");
		canRemove = canRemove.replace(/(^,)|(,$)/g, "");
		canCreate = canCreate.replace(/(^,)|(,$)/g, "");
		
		// trim for good measure
		canView = $.trim(canView);
		canEdit = $.trim(canEdit);
		canPublish = $.trim(canPublish);
		canRemove = $.trim(canRemove);
		canCreate = $.trim(canCreate);
	
        message.showMessage('progress', $('#msg-adding').val());

        $.ajax({
          url: 'api/role/add',
          type: 'POST',
          data: {name: name, canView: canView, canEdit: canEdit, canPublish: canPublish, canRemove: canRemove, canCreate: canCreate},
		  dataType: 'json',
          success: function(data){

            var role = Role.create(data);

			rolesModel.roles.push(role); 

            message.showMessage('success', $('#msg-added').val());
            
            $('#addEditDialog').modal('hide');
          }
        });
        
    },
    
    // edits a role
    editRole: function(o, e){
        
        var name = jQuery.trim($('#name').val());
        
        var roleUniqId = rolesModel.toBeEdited.roleUniqId();
        
        if(name==''){
            message.showMessage('error', $('#msg-all-required').val());
            return;
        }
        
        // init
		var canView = '';
		var canEdit = '';
		var canPublish = '';
		var canRemove = '';
		var canCreate = '';
		
		// get view
		if($('.chk-view-all').prop('checked')){
			canView = 'All';
		}
		else{
			var checks = $('.chk-view');
			
			for(x=0; x<checks.length; x++){
				if($(checks[x]).prop('checked')){
					canView += $(checks[x]).val() + ',';
				}
			}		
		}
		
		// get publish
		if($('.chk-edit-all').prop('checked')){
			canEdit = 'All';
		}
		else{
			var checks = $('.chk-edit');
			
			for(x=0; x<checks.length; x++){
				if($(checks[x]).prop('checked')){
					canEdit += $(checks[x]).val() + ',';
				}
			}		
		}
		
		// get publish
		if($('.chk-publish-all').prop('checked')){
			canPublish = 'All';
		}
		else{
			var checks = $('.chk-publish');
			
			for(x=0; x<checks.length; x++){
				if($(checks[x]).prop('checked')){
					canPublish += $(checks[x]).val() + ',';
				}
			}		
		}
		
		// get remove
		if($('.chk-remove-all').prop('checked')){
			canRemove = 'All';
		}
		else{
			var checks = $('.chk-remove');
			
			for(x=0; x<checks.length; x++){
				if($(checks[x]).prop('checked')){
					canRemove += $(checks[x]).val() + ',';
				}
			}		
		}
		
		// get create
		if($('.chk-create-all').prop('checked')){
			canCreate = 'All';
		}
		else{
			var checks = $('.chk-create');
			
			for(x=0; x<checks.length; x++){
				if($(checks[x]).prop('checked')){
					canCreate += $(checks[x]).val() + ',';
				}
			}		
		}
		
		// remove trailing comma
		canView = canView.replace(/(^,)|(,$)/g, "");
		canEdit = canEdit.replace(/(^,)|(,$)/g, "");
		canPublish = canPublish.replace(/(^,)|(,$)/g, "");
		canRemove = canRemove.replace(/(^,)|(,$)/g, "");
		canCreate = canCreate.replace(/(^,)|(,$)/g, "");
		
		// trim for good measure
		canView = $.trim(canView);
		canEdit = $.trim(canEdit);
		canPublish = $.trim(canPublish);
		canRemove = $.trim(canRemove);
		canCreate = $.trim(canCreate);
		
        message.showMessage('progress', $('#msg-updating').val());

        $.ajax({
          url: 'api/role/edit',
          type: 'POST',
          data: {roleUniqId: roleUniqId, name: name, canView: canView, canEdit: canEdit, canPublish: canPublish, canRemove: canRemove, canCreate: canCreate},
          success: function(data){

            // update the model
            rolesModel.toBeEdited.name(name);
            rolesModel.toBeEdited.canView(canView);
            rolesModel.toBeEdited.canEdit(canEdit);
            rolesModel.toBeEdited.canPublish(canPublish);
            rolesModel.toBeEdited.canRemove(canRemove);
            rolesModel.toBeEdited.canCreate(canCreate);
            
            message.showMessage('success', $('#msg-updated').val());
     
            $('#addEditDialog').modal('hide');
          }
        });    
    },

    // shows a dialog to remove a menuitem
    showRemoveDialog:function(o, e){
		rolesModel.toBeRemoved = o;

		var name = o.name();
        
		$('#removeName').html(name);  // show remove dialog
		$('#deleteDialog').modal('show');

		return false;
	},
    
    removeRole:function(o, e){
        
        var roleUniqId = rolesModel.toBeRemoved.roleUniqId();
        
        message.showMessage('progress', $('#msg-removing').val());
        
        $.ajax({
          url: 'api/role/remove',
          type: 'POST',
          data: {roleUniqId: roleUniqId},
          success: function(data){
            
            rolesModel.roles.remove(rolesModel.toBeRemoved);
              
            message.showMessage('success', $('#msg-removed').val());
    	    $('#deleteDialog').modal('hide');
          }
        });
        
    }
}

rolesModel.init();
