// models the pages page
var pagesModel = {

	hash: null,
	canCreate: null,

	url: ko.observable(''),
	friendlyId: ko.observable('root'), // default is the root
	sort: ko.observable('date'),
	order: ko.observable('desc'),
	pageTypeUniqId: ko.observable('-1'),
	typeS: ko.observable('Page'),
	typeP: ko.observable('Pages'),
	
	pageTypes: ko.observableArray([]),
	pages: ko.observableArray([]), // observables
	pagesLoading: ko.observable(false),
	
	categories: ko.observableArray([]), // observables
	categoriesLoading: ko.observable(false),
	
	stylesheets: ko.observableArray([]),
    stylesheetsLoading: ko.observable(false),
    
    layouts: ko.observableArray([]),
    layoutsLoading: ko.observable(false),
    
    categoryUniqId: ko.observable('-1'),

	toBeRemoved:null,
	
	systemReserved:['api','css','data','files','fragments','js','libs','plugins','themes', 'emails'],
	typeReserved:[],
	pageReserved:[],
	
	currentXHR: null,

	init:function(){ // initializes the model
	
		if(window.localStorage){
		
			if(window.localStorage['show-account-message'] == 'true'){
				window.localStorage['show-account-message'] = 'false';
				$('#account-message').show();
			}
			else{
				$('#account-message').hide();
			}
	    	
    	}
        
        pagesModel.hash = location.hash;
        pagesModel.canCreate = $('#can-create').val();
        
        if(pagesModel.hash!=''){
        	pagesModel.hash = pagesModel.hash.substr(1);
            pagesModel.friendlyId(pagesModel.hash);
        }
        
    	pagesModel.updatePageTypes();
    	pagesModel.updateLayouts();
    	pagesModel.updateStylesheets();
    	
    	$('#name').keyup(function(){
    		var keyed = $(this).val().toLowerCase().replace(/[^a-zA-Z 0-9]+/g,'').replace(/\s/g, '-');
			keyed = keyed.substring(0,25);
			
			// for root pages, check against system names and page type names already created
			if(pagesModel.pageTypeUniqId() == '-1'){
			
				if($.inArray(keyed, pagesModel.systemReserved) != -1){
					keyed = keyed + '1';
				}
				
				if($.inArray(keyed, pagesModel.typeReserved) != -1){
					keyed = keyed + '1';
				}
				
			}
			
			// for non-root pages, check against other pages
			if($.inArray(keyed, pagesModel.pageReserved) != -1){
				keyed = keyed + '1';
			}
			
			$('#friendlyId').val(keyed);
		});
		
		$('#typeS').keyup(function(){
    		var keyed = $(this).val().toLowerCase().replace(/[^a-zA-Z 0-9]+/g,'').replace(/\s/g, '-');
			keyed = keyed.substring(0,25);
			
			// check typeS against system reserved words and other page types
			if($.inArray(keyed, pagesModel.systemReserved) != -1){
				keyed = keyed + '1';
			}
			
			if($.inArray(keyed, pagesModel.typeReserved) != -1){
				keyed = keyed + '1';
			}
			
			$('#typeFriendlyId').val(keyed);
		});

		ko.applyBindings(pagesModel);  // apply bindings
		
	},

	// updates the page types
	updatePageTypes:function(){  // updates the page types arr

		pagesModel.pageTypes.removeAll();
		pagesModel.pagesLoading(true);

		$.ajax({
			url: 'api/pagetype/list/allowed',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){

				pagesModel.typeReserved = [];

				// bool to toggle whether to load pages
				var loadPages = true;

				// find a default if there is not root or hash specified
				if($('#root-item').length == 0 && pagesModel.hash==''){
					
					if(data.length > 0){
						pagesModel.friendlyId(data[0]['FriendlyId']);
					}
					else{
						loadPages = false; // do not load pages
					}
					
				}
				
				// build model
				for(x in data){
				
					// push page type reserved
					pagesModel.typeReserved.push(data[x]['FriendlyId']);

					var pageType = PageType.create(data[x]);
					
					if(pageType.friendlyId() == pagesModel.friendlyId()){
					
						pagesModel.pageTypeUniqId(pageType.pageTypeUniqId());
						pagesModel.typeS(pageType.typeS());
						pagesModel.typeP(pageType.typeP());
						
					}

					pagesModel.pageTypes.push(pageType); 

				}

				// check to make sure there are pages ot load
				if(loadPages){
					pagesModel.updatePages();
					pagesModel.updateCategories();
				}
				
				global.setupFs();
				
			}
		});

	},

	// updates the pages
	updatePages:function(){  // updates the page arr
	
		//if there is a current request, then cancel it
		if(pagesModel.pagesLoading() && pagesModel.currentXhr){
			pagesModel.currentXhr.abort();
		}
		pagesModel.pages.removeAll();
		pagesModel.pagesLoading(true);
        
        var sort = pagesModel.sort() + ' ' + pagesModel.order();
        
        // set data
        var data = {friendlyId: pagesModel.friendlyId(), sort: sort};
        
        if(pagesModel.categoryUniqId() != '-1'){
	        data = {friendlyId: pagesModel.friendlyId(), sort: sort, categoryUniqId: pagesModel.categoryUniqId()};
        }
        
        if(pagesModel.canCreate.indexOf(pagesModel.pageTypeUniqId())>-1 || pagesModel.canCreate == 'All'){
			$('#add-page').show();
			$('nav .fs-container').removeClass('full');
		}
		else{
			$('#add-page').hide();
			$('nav .fs-container').addClass('full');
		}
        
		pagesModel.currentXhr = $.ajax({
			url: 'api/page/list/sorted',
			type: 'POST',
			data: data,
			dataType: 'json',
			success: function(data){
			
				pagesModel.pageReserved = [];

				for(x in data){
				
					pagesModel.pageReserved.push(data[x]['FriendlyId']);
				
					var page = Page.create(data[x]);
					page.hasDraft = ko.observable(data[x]['HasDraft']);
					
					pagesModel.pages.push(page); // push an event to the model

				}

				pagesModel.pagesLoading(false);
				pagesModel.currentXhr = null; //wipe the xhr object now that the request is over

			}
		});

	},
	
	// updates the categories
	updateCategories:function(){  // updates the categories array

		pagesModel.categories.removeAll();
		pagesModel.categoriesLoading(true);
        
		$.ajax({
			url: 'api/category/list/all',
			type: 'POST',
			data: {pageTypeUniqId:pagesModel.pageTypeUniqId()},
			dataType: 'json',
			success: function(data){
			
				console.log(data[x]);

				for(x in data){
				
					var category = Category.create(data[x]);
					
					console.log(category);
					
					pagesModel.categories.push(category); // push a category to the model
				}

				pagesModel.categoriesLoading(false);

			}
		});

	},
	
	// updates the stylesheets
	updateStylesheets:function(){ // gets the stylesheets for the current theme

		pagesModel.stylesheetsLoading(true);

		$.ajax({
			url: 'api/stylesheet/list',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
				pagesModel.stylesheets(data);
				pagesModel.stylesheetsLoading(false);
			}
		});
	},

	// updates the layouts
	updateLayouts:function(){ // gets the layouts for the current theme

		pagesModel.layoutsLoading(true);

		$.ajax({
			url: 'api/layout/list',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
				pagesModel.layouts(data);
				pagesModel.layoutsLoading(false);
			}
		});
	},

	// switches page types
	switchPageType:function(o, e){  // switches b/w page types
	
		$('#account-message').fadeOut();

		var curr = $(e.target);

		var friendlyId = curr.attr('data-friendlyid');
		var url = curr.attr('data-friendlyid');
		var pageTypeUniqId = curr.attr('data-pagetypeuniqid');
		var typeS = curr.attr('data-types');
		var typeP = curr.attr('data-typep');
		var layout = curr.attr('data-layout');
		var stylesheet = curr.attr('data-stylesheet');
		
        location.hash = friendlyId;
        
		if(friendlyId=='root'){
			url = '';
		}
		
		pagesModel.friendlyId(friendlyId);
		pagesModel.url(url);
		pagesModel.pageTypeUniqId(pageTypeUniqId);
		pagesModel.typeS(typeS);

		pagesModel.updatePages();
		pagesModel.updateCategories();

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

	// shows the add page dialog
	showAddDialog:function(o, e){ // shows a dialog to add a page
		$('#name').val('');
		$('#friendlyId').val('');
		$('#description').val('');
		$('.categories-list input[type=checkbox]').attr('checked', false);
	
		$('#addDialog').modal('show');

		return false;
	},
    
    // adds a page
    showAddPageTypeDialog:function(o, e){ // shows a dialog to add a page
    	$('#typeS').val('');
		$('#typeP').val('');
		$('#typeFriendlyId').val('');
	
		$('#pageTypeDialog').modal('show');
		
		$('#pageTypeDialog').find('.add').show();
		$('#pageTypeDialog').find('.edit').hide();
		
		// init data
		$('#typeS').val('');
		$('#typeP').val('');
		$('#typeFriendlyId').val('');
		$('#layout').val('content');
		$('#stylesheet').val('content');
		$('#isSecure').val('0');

		return false;
	},
	
	// edits a page
    showEditPageTypeDialog:function(o, e){ // shows a dialog to add a page
    	
    	$('#pageTypeDialog').modal('show');
    	
    	$('#pageTypeDialog').find('.edit').show();
		$('#pageTypeDialog').find('.add').hide();

		// init data
		var curr = $('nav li.active a');
				
		var typeS = curr.attr('data-types');
		var typeP = curr.attr('data-typep');
		var layout = curr.attr('data-layout');
		var stylesheet = curr.attr('data-stylesheet');
		var isSecure = curr.attr('data-issecure');
		
		$('#typeS').val(typeS);
		$('#typeP').val(typeP);
		$('#layout').val(layout);
		$('#stylesheet').val(stylesheet);
		$('#isSecure').val(isSecure);

		return false;
	},

	// adds a page
	addPage:function(){  

		var pageTypeUniqId = pagesModel.pageTypeUniqId();
		
		var name = $.trim($('#name').val());
        var friendlyId = $.trim($('#friendlyId').val());
        var description = $.trim($('#description').val());
        
        if(name=='' || friendlyId==''){
            message.showMessage('error', $('#msg-add-error').val());
            return;
        }
        
        var checks = $('.categories-list input[type=checkbox]:checked');
		var categories = '';
      
		for(var x=0; x<checks.length; x++){
			categories += $(checks[x]).val() + ',';
		}

		if(categories.length>0)categories=categories.substring(0,categories.length-1);
		
        message.showMessage('progress', $('#msg-adding').val());
        
        $.ajax({
          url: 'api/page/add',
          type: 'POST',
          data: {pageTypeUniqId: pageTypeUniqId, name: name, friendlyId: friendlyId, description: description, categories: categories},
          success: function(data){

          	pagesModel.updatePages();

    	    $('#addDialog').modal('hide');
            
            message.showMessage('success', $('#msg-added').val());
          }
        });

	},
	
	// removes a page
	removePage:function(){

		message.showMessage('progress',  $('#msg-removing').val());

		$.ajax({
			url: 'api/page/'+pagesModel.toBeRemoved.pageUniqId(),
			type: 'DELETE',
			data: {},
			dataType: 'json',
			success: function(data){
				pagesModel.pages.remove(pagesModel.toBeRemoved); // remove the page from the model

				$('#deleteDialog').modal('hide');

				message.showMessage('success',  $('#msg-removed').val());
			},
			error: function(data){
				message.showMessage('error', $('#msg-remove-error').val());
			}
		});

	},
    
    // adds a page type
    addPageType:function(){

		var typeFriendlyId = $.trim($('#typeFriendlyId').val());
        var typeS = $.trim($('#typeS').val());
        var typeP = $.trim($('#typeP').val());
        var layout = $.trim($('#layout').val());
        var stylesheet = $.trim($('#stylesheet').val());
        var isSecure = $.trim($('#isSecure').val());
        
        if(typeFriendlyId == '' || typeS == '' || typeP == ''){
            message.showMessage('error', $('#msg-all-required').val());
            return;
        }

        message.showMessage('progress', $('#msg-type-adding').val());

        $.ajax({
          url: 'api/pagetype/add',
          type: 'POST',
		  dataType: 'json',
          data: {friendlyId: typeFriendlyId, typeS: typeS, typeP: typeP, layout: layout, stylesheet: stylesheet, isSecure: isSecure},
          success: function(data){

          	var pageType = PageType.create(data);
          	
          	pagesModel.pageTypes.push(pageType);

    	    $('#pageTypeDialog').modal('hide');
            
            message.showMessage('success', $('#msg-type-added').val());
          }
        });

	},
	
	 // edits a page type
    editPageType:function(){

		var typeS = $.trim($('#typeS').val());
        var typeP = $.trim($('#typeP').val());
        var layout = $.trim($('#layout').val());
        var stylesheet = $.trim($('#stylesheet').val());
        var isSecure = $.trim($('#isSecure').val());
        
        if(typeFriendlyId == '' || typeS == '' || typeP == ''){
            message.showMessage('error', $('#msg-all-required').val());
            return;
        }

        message.showMessage('progress', $('#msg-type-updating').val());

        $.ajax({
			url: 'api/pagetype/edit',
			type: 'POST',
			dataType: 'json',
			data: {pageTypeUniqId: pagesModel.pageTypeUniqId(), typeS: typeS, typeP: typeP, layout: layout, stylesheet: stylesheet, isSecure: isSecure},
			success: function(data){
			
				pagesModel.typeS(typeS);
				pagesModel.typeP(typeP);
				
				var curr = $('nav li.active a');
				
				curr.attr('data-types', typeS);
				curr.attr('data-typep', typeP);
				curr.attr('data-layout', layout);
				curr.attr('data-stylesheet', stylesheet);
				
				message.showMessage('success', $('#msg-type-updated').val());
				
				$('#pageTypeDialog').modal('hide');
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
	
	// removes a page type
	removePageType:function(){  // removes a page

		message.showMessage('progress', $('#msg-type-removing').val());

		$.ajax({
			url: 'api/pagetype/'+pagesModel.toBeRemoved.pageTypeUniqId(),
			type: 'DELETE',
			data: {},
			dataType: 'json',
			success: function(data){
				pagesModel.pageTypes.remove(pagesModel.toBeRemoved); // remove the page from the model

				$('#deletePageTypeDialog').modal('hide');

				message.showMessage('success', $('#msg-type-removed').val());
			},
			error: function(data){
				message.showMessage('error', $('#msg-type-remove-error').val());
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
					message.showMessage('success', $('#msg-unpublished').val());
				}
				else{
					page.isActive(1);
					message.showMessage('success', $('#msg-published').val());
				}
			},
			error: function(data){
				message.showMessage('error', $('#msg-publish-error').val());
			}
		});
	},
	
	// sort
	sortName:function(o,e){
		pagesModel.sort('name');
		pagesModel.order('asc');
		
		pagesModel.updatePages();
		$('.list-menu-actions a').removeClass('active');
		$(e.target).parent().addClass('active');
	},
	
	sortDate:function(o,e){
		pagesModel.sort('date');
		pagesModel.order('desc');
		
		pagesModel.updatePages();
		$('.list-menu-actions a').removeClass('active');
		$(e.target).parent().addClass('active');
	},
	
	// shows add category dialog
	showAddCategoryDialog:function(o, e){ // shows a dialog to add a page
		$('#categoryName').val('');
		$('#categoryFriendlyId').val('');
		
		$('#addCategoryDialog').modal('show');

		return false;
	},
	
	// adds a category
	addCategory:function(){  

		var pageTypeUniqId = pagesModel.pageTypeUniqId();
		
		var name = $.trim($('#categoryName').val());
        var friendlyId = $.trim($('#categoryFriendlyId').val());
        
        if(name=='' || friendlyId==''){
            message.showMessage('error', $('#msg-add-error').val());
            return;
        }
        
        message.showMessage('progress', $('#msg-category-adding').val());
        
        $.ajax({
          url: 'api/category/add',
          type: 'POST',
          data: {pageTypeUniqId: pageTypeUniqId, name: name, friendlyId: friendlyId},
          success: function(data){

          	pagesModel.updateCategories();

    	    $('#addCategoryDialog').modal('hide');
            
            message.showMessage('success', $('#msg-category-added').val());
          }
        });

	},
	
	// shows a dialog to remove a category
	showRemoveCategoryDialog:function(o, e){
	
		pagesModel.toBeRemoved = o;

		console.log(o);

		var name = pagesModel.toBeRemoved.name();
		
		$('#removeCategoryName').html(name);  // show remove dialog
		$('#deleteCategoryDialog').modal('show');

		return false;
	},
	
	// removes a category
	removeCategory:function(){  // removes a page

		message.showMessage('progress', $('#msg-category-removing').val());

		$.ajax({
			url: 'api/category/'+pagesModel.toBeRemoved.categoryUniqId(),
			type: 'DELETE',
			data: {},
			dataType: 'json',
			success: function(data){
				pagesModel.categories.remove(pagesModel.toBeRemoved); // remove the page from the model

				$('#deleteCategoryDialog').modal('hide');

				message.showMessage('success', $('#msg-category-removed').val());
			},
			error: function(data){
				message.showMessage('error', $('#msg-category-remove-error').val());
			}
		});

	},
	
	// sets the categoryUniqId
	setCategory:function(o, e){
		$('#categories .current-category').text(o.name());
		pagesModel.categoryUniqId(o.categoryUniqId);
		pagesModel.updatePages();
	},
	
	// resets the categoryUniqId
	resetCategory:function(o, e){
		$('#categories .current-category').text($(e.target).text());
		pagesModel.categoryUniqId('-1');
		pagesModel.updatePages();
	}
}

pagesModel.init();