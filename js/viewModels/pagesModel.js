// models the pages page
var pagesModel = {

	url: ko.observable(''),
	friendlyId: ko.observable('root'), // default is the root
	pageTypeUniqId: ko.observable('-1'),
	typeS: ko.observable('Page'),
	typeP: ko.observable('Pages'),
	pageTypes: ko.observableArray([]),
	pages: ko.observableArray([]), // observables
	pagesLoading: ko.observable(false),

	toBeRemoved:null,

	init:function(){ // initializes the model
        
        var hash = location.hash;
        
        if(hash!=''){
            hash = hash.substr(1);
            pagesModel.friendlyId(hash);
        }
        
    	pagesModel.updatePageTypes();

		ko.applyBindings(pagesModel);  // apply bindings
	},

	updatePageTypes:function(){  // updates the page types arr

		pagesModel.pageTypes.removeAll();
		pagesModel.pagesLoading(true);

		$.ajax({
			url: 'api/pagetype/list/all',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){

				for(x in data){

					var pageType = PageType.create(data[x]);

					pagesModel.pageTypes.push(pageType); 

				}

				pagesModel.updatePages();

			}
		});

	},

	updatePages:function(){  // updates the page arr

		pagesModel.pages.removeAll();
		pagesModel.pagesLoading(true);
        
		$.ajax({
			url: 'api/page/list/'+pagesModel.friendlyId(),
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){

				for(x in data){

					var page = Page.create(data[x]);
                    
					pagesModel.pages.push(page); // push an event to the model

				}

				pagesModel.pagesLoading(false);

			}
		});

	},

	switchPageType:function(o, e){  // switches b/w page types

		var curr= $(e.target);

		var friendlyId = curr.attr('data-friendlyid');
		var url = curr.attr('data-friendlyid');
		var pageTypeUniqId = curr.attr('data-pagetypeuniqid');
		var typeS = curr.attr('data-types');
		var typeP = curr.attr('data-typep');
        
        location.hash = friendlyId;
        
		if(friendlyId=='root'){
			url = '';
		}

		pagesModel.friendlyId(friendlyId);
		pagesModel.url(url);
		pagesModel.pageTypeUniqId(pageTypeUniqId);
		pagesModel.typeS(typeS);
		pagesModel.typeP(typeP);

		pagesModel.updatePages();

	},

	// shows a dialog to remove a page
	showRemoveDialog:function(o, e){
		pagesModel.toBeRemoved = o;

		var id = o.pageUniqId();
		var name = o.name();
		
		$('#removeName').html(name);  // show remove dialog
		$('#deleteDialog').data('id', id);
		$('#deleteDialog').modal('show');

		return false;
	},

	showAddDialog:function(o, e){ // shows a dialog to add a page
		$('#name').val('');
		$('#friendlyId').val('');
		$('#description').val('');
	
		$('#addDialog').modal('show');

		return false;
	},
    
    showAddPageTypeDialog:function(o, e){ // shows a dialog to add a page
    	$('#typeS').val('');
		$('#typeP').val('');
		$('#typeFriendlyId').val('');
	
		$('#addPageTypeDialog').modal('show');

		return false;
	},

	addPage:function(){  // adds a page

		var pageTypeUniqId = pagesModel.pageTypeUniqId();
		var name = $.trim($('#name').val());
        var friendlyId = $.trim($('#friendlyId').val());
        var description = $.trim($('#description').val());
        
        if(name=='' || friendlyId==''){
            message.showMessage('error', 'Name and Friendly URL are required');
            return;
        }
        
        message.showMessage('progress', 'Adding page...');
        
        $.ajax({
          url: 'api/page/add',
          type: 'POST',
          data: {pageTypeUniqId: pageTypeUniqId, name: name, friendlyId: friendlyId, description: description},
          success: function(data){

          	var page = Page.create(data);
          	
          	pagesModel.pages.push(page);

    	    $('#addDialog').modal('hide');
            
            message.showMessage('success', 'The page was added successfully');
          }
        });

	},
	
	removePage:function(){  // removes a page

		message.showMessage('progress', 'Removing page...');

		$.ajax({
			url: 'api/page/'+pagesModel.toBeRemoved.pageUniqId(),
			type: 'DELETE',
			data: {},
			dataType: 'json',
			success: function(data){
				pagesModel.pages.remove(pagesModel.toBeRemoved); // remove the page from the model

				$('#deleteDialog').modal('hide');

				message.showMessage('success', 'The page was removed successfully');
			},
			error: function(data){
				message.showMessage('error', 'There was a problem removing the page');
			}
		});

	},
    
    addPageType:function(){  // adds a page

		var typeFriendlyId = $.trim($('#typeFriendlyId').val());
        var typeS = $.trim($('#typeS').val());
        var typeP = $.trim($('#typeP').val());
        
        if(typeFriendlyId == '' || typeS == '' || typeP == ''){
            message.showMessage('error', 'All fields are required');
            return;
        }

        message.showMessage('progress', 'Adding page...');

        $.ajax({
          url: 'api/pagetype/add',
          type: 'POST',
		  dataType: 'json',
          data: {friendlyId: typeFriendlyId, typeS: typeS, typeP: typeP},
          success: function(data){

          	var pageType = PageType.create(data);
          	
          	pagesModel.pageTypes.push(pageType);

    	    $('#addPageTypeDialog').modal('hide');
            
            message.showMessage('success', 'The page type was added successfully');
          }
        });

	},
    
    // shows a dialog to remove a pagetype
    showRemovePageTypeDialog:function(o, e){
		pagesModel.toBeRemoved = o;

		var id = o.pageTypeUniqId();
		var name = o.typeP();
		
		$('#removePageTypeName').html(name);  // show remove dialog
		$('#deletePageTypeDialog').data('id', id);
		$('#deletePageTypeDialog').modal('show');

		return false;
	},
	
	removePageType:function(){  // removes a page

		message.showMessage('progress', 'Removing page type...');

		$.ajax({
			url: 'api/pagetype/'+pagesModel.toBeRemoved.pageTypeUniqId(),
			type: 'DELETE',
			data: {},
			dataType: 'json',
			success: function(data){
				pagesModel.pageTypes.remove(pagesModel.toBeRemoved); // remove the page from the model

				$('#deletePageTypeDialog').modal('hide');

				message.showMessage('success', 'The page type was removed successfully');
			},
			error: function(data){
				message.showMessage('error', 'There was a problem removing the page type');
			}
		});

	},

	// toggles b/w active states (publishes, unpublishes page)
	toggleActive:function(page){
		var isActive = page.isActive();

		var url = 'api/page/publish/'+page.pageUniqId();

		if(isActive==1){
			url = 'api/page/unpublish/'+page.pageUniqId();
		}

		$.ajax({
			url: url,
			type: 'POST',
			data: {},
			dataType: 'json',
			success: function(data){
				if(isActive==1){
					page.isActive(0);
					message.showMessage('success', 'The page was unpublished successfully');
				}
				else{
					page.isActive(1);
					message.showMessage('success', 'The page was published successfully');
				}
			},
			error: function(data){
				if(isActive==1){
					message.showMessage('error', 'There was a problem unpublishing the page');
				}
				else{
					message.showMessage('error', 'There was a problem publishing the page');
				}
			}
		});
	}
}

pagesModel.init();