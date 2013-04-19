// models the menus page
var menusModel = {

	type: ko.observable('primary'),
	menuTypes: ko.observableArray([]),
    menuItems: ko.observableArray([]),
	menuLoading: ko.observable(true),

    pages: ko.observableArray([]),
    pagesLoading: ko.observable(false),

	toBeRemoved: null,
    toBeEdited: null,

	init:function(){ // initializes the model
		menusModel.updateMenuTypes();	
        
        menusModel.setupControls();

		ko.applyBindings(menusModel);  // apply bindings
	},
    
    setupControls:function(){
        $('#selectPage li').live('click', function(){
    		$('#selectPage li').removeClass('selected');
			$(this).addClass('selected');			
        	document.getElementById('existing').checked = true;	
            
            // default name
            var name = $(this).find('span').text();
            $('#name').val(name);

		});
        
        $('#url').click(function(){
        	$('#selectPage li').removeClass('selected');
    		document.getElementById('customUrl').checked = true;	
		});  
        
    },

	updateMenuTypes:function(){

		menusModel.menuTypes.removeAll();
		menusModel.menuLoading(true);

		$.ajax({
			url: './api/menutype/list/all',
			type: 'GET',
			data: {},
			success: function(data){

				for(x in data){

					var menuType = MenuType.create(data[x]);

					menusModel.menuTypes.push(menuType); 

				}

				menusModel.updateMenuItems();

			}
		}, 'json');

	},

	updateMenuItems: function(){
        
        menusModel.menuItems.removeAll();
        
		$.ajax({
			url: './api/menuitem/list/'+menusModel.type(),
			type: 'GET',
			data: {},
			success: function(data){

				for(x in data){

					var menuItem = MenuItem.create(data[x]);

					menusModel.menuItems.push(menuItem); 

				}

                menusModel.menuLoading(false);
                
                $('div.list').sortable({handle:'span.hook', placeholder: 'placeholder', opacity:'0.6', stop:function(){
                    $('#save').fadeIn();
                }});
			}
		}, 'json');

	},
    
    updatePages:function(){  // updates the pages arr

    	menusModel.pages.removeAll();
		menusModel.pagesLoading(true);

		$.ajax({
			url: './api/page/list/all',
			type: 'GET',
			data: {},
			success: function(data){

				for(x in data){
					var page = Page.create(data[x]);
					menusModel.pages.push(page); 
				}

				menusModel.pagesLoading(false);

			}
		}, 'json');

	},

    showAddDialog:function(o, e){ // shows a dialog to add a page
    
        menusModel.updatePages(); // update the pages in the model
    
        $('#addEditDialog').data('mode', 'add');
    	$('#addEditDialog h3').html('Add Menu Item');
		$('#addEditDialog .primary-button').text('Add Menu Item');
        
        $('#addEditDialog .edit').hide();
        $('#addEditDialog .add').show();
		
		$('#name').val('');	
		$('#selectPage li').removeClass('selected');
		
		$('#cssClass').val('');
		$('#url').val('');	
		$('#existingUrl').val('');
		$('#existing').attr('checked','checked');

		$('#addEditDialog').modal('show');

		return false;
	},
    
    showEditDialog:function(o, e){ // shows a dialog to add a page
    
        $('#addEditDialog').data('mode', 'edit');
        $('#addEditDialog h3').html('Edit Menu Item');
		$('#addEditDialog .primary-button').text('Update Menu Item');
		
		$('#addEditDialog .edit').show();
        $('#addEditDialog .add').hide();
		
    	$('#name').val(o.name());	
		$('#cssClass').val(o.cssClass());
		$('#editUrl').val(o.url());	
        
        menusModel.toBeEdited = o;

		$('#addEditDialog').modal('show');

		return false;
	},
    
    addEditMenuItem: function(o, e){
        
        var dialog = $('#addEditDialog');
        
        var name = $('#name').val();
        var cssClass = $('#cssClass').val();
        var type = menusModel.type();
        var url = $('#url').val();
        var existingUrl = $('#existingUrl').val();
           
        if(dialog.data('mode')=='add'){ // add
        
            var priority = $('#menuItemsList').find('.listItem').length; // add to end by default
            var pageId = -1;
            
            if(document.getElementById('existing').checked){
        		var selected = $('#selectPage li.selected');
                
                if(selected.length==0){
                    message.showMessage('error', 'Select a page from the list');
                    return;
                }
                else{
                    url = selected.first().data('url');
                    pageId = selected.first().data('pageid');
                }
    		}
        
            message.showMessage('progress', 'Adding menu item...');

            $.ajax({
              url: './api/menuitem/add',
              type: 'POST',
              data: {name: name, cssClass: cssClass, type: type, url: url, pageId: pageId, priority: priority},
              success: function(data){
    
                var item = MenuItem.create(data);
              	
              	menusModel.menuItems.push(item);
    
                message.showMessage('success', 'The menu item was added successfully');
                
                $('#addEditDialog').modal('hide');
              }
            }, 'json');
            
        }
        else{ // edit
            var menuItemUniqId = menusModel.toBeEdited.menuItemUniqId();
       
            var name = $('#name').val();
            var cssClass = $('#cssClass').val();
            var url = $('#editUrl').val();
            
            message.showMessage('progress', 'Updating menu item...');

            $.ajax({
              url: './api/menuitem/' + menuItemUniqId,
              type: 'POST',
              data: {name: name, cssClass: cssClass, url: url},
              success: function(data){
    
                // update the model
                menusModel.toBeEdited.name(name);
                menusModel.toBeEdited.cssClass(cssClass);
                menusModel.toBeEdited.url(url);
                
                message.showMessage('success', 'The menu item was updated successfully');
         
                $('#addEditDialog').modal('hide');
              }
            });
            
            
        }
        
    },

    showPrimary: function(o, e){
        menusModel.type('primary');
        menusModel.updateMenuItems();
    },
    
    showFooter: function(o, e){
        menusModel.type('footer');
        menusModel.updateMenuItems();
    },
    
    showMenuType: function(o, e){
        menusModel.type(o.friendlyId());
        menusModel.updateMenuItems();
    },
    
    saveOrder: function(){
        
        var items = $('#menuItemsList .listItem');
        
        var order = {};
        
        for(var x=0; x<items.length; x++){
            var id = $(items[x]).data('id');
            order[id] = x;
        }
        
        var json = JSON.stringify(order);
        
        $.ajax({
          url: './api/menuitem/order',
          type: 'POST',
          data: {json: json},
          success: function(data){
            message.showMessage('success', 'The order was updated successfully');
            $('#save').hide();
          }
        });
        
    },
    
    // shows a dialog to remove a menuitem
    showRemoveDialog:function(o, e){
		menusModel.toBeRemoved = o;

		var id = o.menuItemUniqId();
		var name = o.name();
		
		$('#removeName').html(name);  // show remove dialog
		$('#deleteDialog').data('id', id);
		$('#deleteDialog').modal('show');

		return false;
	},
    
    removeMenuItem: function(o, e){
        
        var menuItemUniqId = menusModel.toBeRemoved.menuItemUniqId();
        
        $.ajax({
          url: './api/menuitem/'+menuItemUniqId,
          type: 'DELETE',
          data: {},
          success: function(data){
            
            menusModel.menuItems.remove(menusModel.toBeRemoved); // 
              
            message.showMessage('success', 'The menu item was deleted successfully');
    	    $('#deleteDialog').modal('hide');
          }
        });
        
    },
    
    showAddMenuTypeDialog:function(o, e){
        
        $('#menuTypeName').val('');  // show remove dialog
        $('#menuTypeFriendlyId').val('');
        
		$('#addMenuTypeDialog').modal('show');   
    },
    
    addMenuType:function(o, e){
        
        var name = $('#menuTypeName').val();
        var friendlyId = $('#menuTypeFriendlyId').val();
        
        $.ajax({
          url: './api/menutype/add',
          type: 'POST',
          data: {name: name, friendlyId: friendlyId},
          success: function(data){

            var menuType = MenuType.create(data);
              
          	menusModel.menuTypes.push(menuType);

            message.showMessage('success', 'The menu type was added successfully');
            
            $('#addMenuTypeDialog').modal('hide');
          }
        }, 'json');
        
    },
    
    showRemoveMenuTypeDialog:function(o, e){
        
        menusModel.toBeRemoved = o;
        
    	$('#deleteMenuTypeDialog').modal('show');
    },
    
    removeMenuType:function(o, e){
        
        var menuTypeUniqId = menusModel.toBeRemoved.menuTypeUniqId();
        
        $.ajax({
          url: './api/menutype/'+menuTypeUniqId,
          type: 'DELETE',
          data: {},
          success: function(data){
            
            menusModel.menuTypes.remove(menusModel.toBeRemoved);
              
            message.showMessage('success', 'The menu type was deleted successfully');
            $('#deleteMenuTypeDialog').modal('hide');
          }
        });
        
    }
    
}

menusModel.init();
