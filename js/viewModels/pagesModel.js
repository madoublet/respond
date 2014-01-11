// models the pages page
var pagesModel = {

	hash: null,

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
	
	stylesheets: ko.observableArray([]),
    stylesheetsLoading: ko.observable(false),
    
    layouts: ko.observableArray([]),
    layoutsLoading: ko.observable(false),

	toBeRemoved:null,

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
			$('#friendlyId').val(keyed);
		});

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
					
					console.log(data[x]);
					
					if(pageType.friendlyId() == pagesModel.friendlyId()){
					
						pagesModel.pageTypeUniqId(pageType.pageTypeUniqId());
						pagesModel.typeS(pageType.typeS());
						pagesModel.typeP(pageType.typeP());
						
					}

					pagesModel.pageTypes.push(pageType); 

				}

				pagesModel.updatePages();
				
				global.setupFs();
				
			}
		});

	},

	updatePages:function(){  // updates the page arr

		pagesModel.pages.removeAll();
		pagesModel.pagesLoading(true);
        
        var sort = pagesModel.sort() + ' ' + pagesModel.order();
        
		$.ajax({
			url: 'api/page/list/sorted',
			type: 'POST',
			data: {friendlyId: pagesModel.friendlyId(), sort: sort},
			dataType: 'json',
			success: function(data){

				for(x in data){
				
					var page = Page.create(data[x]);
					page.hasDraft = ko.observable(data[x]['HasDraft']);
                    
					pagesModel.pages.push(page); // push an event to the model

				}

				pagesModel.pagesLoading(false);

			}
		});

	},
	
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
		
		$('#typeS').val(typeS);
		$('#typeP').val(typeP);
		$('#layout').val(layout);
		$('#stylesheet').val(stylesheet);

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
        
        message.showMessage('progress', $('#msg-adding').val());
        
        $.ajax({
          url: 'api/page/add',
          type: 'POST',
          data: {pageTypeUniqId: pageTypeUniqId, name: name, friendlyId: friendlyId, description: description},
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
        
        if(typeFriendlyId == '' || typeS == '' || typeP == ''){
            message.showMessage('error', $('#msg-all-required').val());
            return;
        }

        message.showMessage('progress', $('#msg-type-adding').val());

        $.ajax({
          url: 'api/pagetype/add',
          type: 'POST',
		  dataType: 'json',
          data: {friendlyId: typeFriendlyId, typeS: typeS, typeP: typeP, layout: layout, stylesheet: stylesheet},
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
        
        if(typeFriendlyId == '' || typeS == '' || typeP == ''){
            message.showMessage('error', $('#msg-all-required').val());
            return;
        }

        message.showMessage('progress', $('#msg-type-updating').val());

        $.ajax({
			url: 'api/pagetype/edit',
			type: 'POST',
			dataType: 'json',
			data: {pageTypeUniqId: pagesModel.pageTypeUniqId(), typeS: typeS, typeP: typeP, layout: layout, stylesheet: stylesheet},
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
	}
}

pagesModel.init();