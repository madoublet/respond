// models the content page
var contentModel = {

    pageUniqId: ko.observable(''),
    pageTypeUniqId: ko.observable(''),
    page: ko.observable(null),
    toPagePrefix: ko.observable(''),
    domain: ko.observable(''),
    appUrl: ko.observable(''),
    
    content: ko.observable(''),
    contentLoading: ko.observable(false),
    pageTypes: ko.observableArray([]),
    
    categories: ko.observableArray([]), // observables
    categoriesForPage: ko.observable(), // comma separated list of current categories
	categoriesLoading: ko.observable(false),
    
    pages: ko.observableArray([]),
    pagesLoading: ko.observable(false),
    
    themePages: ko.observableArray([]),
	themePagesLoading: ko.observable(false),
    
    plugins: ko.observableArray([]),
    pluginsLoading: ko.observable(false),
    
    stylesheets: ko.observableArray([]),
    stylesheetsLoading: ko.observable(false),
    
    layouts: ko.observableArray([]),
    layoutsLoading: ko.observable(false),
    
    images: ko.observableArray([]),
    imagesLoading: ko.observable(false),
    
    newimages: ko.observableArray([]),
    
    files: ko.observableArray([]),
    filesLoading: ko.observable(false),
    
    icons: ko.observableArray([]),
    iconsLoading: ko.observable(false),
    
    fullUrl: ko.observable(''),
    
    previewUrl: '',

	init:function(){ // initializes the model
		var p = global.getQueryStringByName('p');
		var d = $('body').attr('data-domain');
		var a = $('body').attr('data-appurl');
		
		contentModel.domain(d);
		contentModel.appUrl(a);
		contentModel.pageUniqId(p);

		contentModel.updateContent();
		contentModel.updatePage();
		contentModel.updatePageTypes();
		

		ko.applyBindings(contentModel);  // apply bindings
	},

	updateContent:function(){ // retrieves the content for the page
		
		contentModel.contentLoading(true);

		$.ajax({
			url: 'api/page/content/'+contentModel.pageUniqId(),
			type: 'GET',
			data: {},
			success: function(data){
			
				contentModel.content(data);
				contentModel.contentLoading(false);
                
                // setup editor
    			var editor = $('#desc').get(0);
    			
    			// create editor
    			new respond.Editor({
	    			el: editor
    			});
    			
    			
                // oh so pretty
                prettyPrint();
                
                // setup flipsnap
			    var fs = Flipsnap('.editor-actions div', {distance: 400, maxPoint:3});
                
                $('.fs-next').on('click', function(){
                    fs.toNext(); 
                    
                    if(fs.hasPrev()){
                        $('.fs-prev').show();
                    }
                    else{
                        $('.fs-prev').hide();
                    }
                    
                    if(fs.hasNext()){
                        $('.fs-next').show();
                    }
                    else{
                        $('.fs-next').hide();
                    }
                });
                
                $('.fs-prev').on('click', function(){
                    fs.toPrev(); 
                    
                    if(fs.hasPrev()){
                        $('.fs-prev').show();
                    }
                    else{
                        $('.fs-prev').hide();
                    }
                    
                    if(fs.hasNext()){
                        $('.fs-next').show();
                    }
                    else{
                        $('.fs-next').hide();
                    }
                });
            
            }
		});

	},
	
	// updates the categories
	updateCategories:function(){  // updates the categories array

		contentModel.categories.removeAll();
		contentModel.categoriesLoading(true);
		
		$.ajax({
			url: 'api/category/list/all',
			type: 'POST',
			data: {pageTypeId: contentModel.page().pageTypeId},
			dataType: 'json',
			success: function(data){
			
				for(x in data){
				
					var category = Category.create(data[x]);
					
					contentModel.categories.push(category); // push a category to the model
				}

				contentModel.categoriesLoading(false);

			}
		});

	},
	
	// updates the categories
	updateCategoriesForPage:function(){  // updates the categories array
	
		contentModel.categories.removeAll();
		contentModel.categoriesLoading(true);
		
		$.ajax({
			url: 'api/category/list/page',
			type: 'POST',
			data: {pageId: contentModel.page().pageId},
			dataType: 'json',
			success: function(data){
			
				var c = '';

				for(x in data){
				
					c += data[x]['CategoryUniqId'] + ',';
				}
				
				c = c.replace(/,+$/, "");
				
				contentModel.categoriesForPage(c);

			}
		});

	},
	
	// updates the categories
	updateCategoriesWithFriendlyId:function(friendlyId, callback){  // updates the categories array

		contentModel.categories.removeAll();
		contentModel.categoriesLoading(true);
		
		$.ajax({
			url: 'api/category/list/all',
			type: 'POST',
			data: {friendlyId: friendlyId},
			dataType: 'json',
			success: function(data){
			
				console.log(data[x]);

				for(x in data){
				
					var category = Category.create(data[x]);
					
					console.log(category);
					
					contentModel.categories.push(category); // push a category to the model
				}

				contentModel.categoriesLoading(false);
				
				callback();

			}
		});

	},
	
	// updates the categories
	updateCategoriesWithPageTypeUniqId:function(pageTypeUniqId, callback){  // updates the categories array

		contentModel.categories.removeAll();
		contentModel.categoriesLoading(true);
		
		$.ajax({
			url: 'api/category/list/all',
			type: 'POST',
			data: {pageTypeUniqId: pageTypeUniqId},
			dataType: 'json',
			success: function(data){
			
				console.log(data);

				for(x in data){
				
					var category = Category.create(data[x]);
					
					console.log(category);
					
					contentModel.categories.push(category); // push a category to the model
				}

				contentModel.categoriesLoading(false);
				
				callback();

			}
		});

	},
	
	// update the page types
	updatePageTypes:function(){  // updates the page types arr

		contentModel.pageTypes.removeAll();

		$.ajax({
			url: 'api/pagetype/list/all',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){

				for(x in data){

					var pageType = PageType.create(data[x]);

					contentModel.pageTypes.push(pageType); 

				}

			}
		});

	},

	// updates the pages
	updatePages:function(){ 

		contentModel.pages.removeAll();
		contentModel.pagesLoading(true);

		$.ajax({
			url: 'api/page/list/all',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){

				for(x in data){
                    console.log(data[x]);
					var page = Page.create(data[x]);
					contentModel.pages.push(page); 
				}

				contentModel.pagesLoading(false);

			}
		});

	},
	
	// updates the pages in the current theme
	updateThemePages:function(){  // updates the page arr

		contentModel.themePages.removeAll();
		contentModel.themePagesLoading(true);
        
		$.ajax({
			url: 'api/theme/pages/list',
			type: 'GET',
			dataType: 'json',
			success: function(data){

				for(x in data){
				
					var page = {
						'name':data[x]['name'],
						'fileName':data[x]['fileName'],
						'location':data[x]['location']
					}
                    
					contentModel.themePages.push(page); // push an event to the model

				}

				contentModel.themePagesLoading(false);

			}
		});

	},

	// updates the plugins
	updatePlugins:function(){

		contentModel.pluginsLoading(true);

		$.ajax({
			url: 'api/plugin/',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
				contentModel.plugins(data);
				contentModel.pluginsLoading(false);
			}
		});
	},

	// updates the stylesheets for the current template
	updateStylesheets:function(){ 

		contentModel.stylesheetsLoading(true);

		$.ajax({
			url: 'api/stylesheet/list',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
				contentModel.stylesheets(data);
				contentModel.stylesheetsLoading(false);
			}
		});
	},

	// updates the layouts for the current template
	updateLayouts:function(){ 

		contentModel.layoutsLoading(true);

		$.ajax({
			url: 'api/layout/list',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
				contentModel.layouts(data);
				contentModel.layoutsLoading(false);
			}
		});
	},

	// saves the settings for the page
	saveSettings:function(i,e){ 

		message.showMessage('progress', $('#msg-settings-saving').val());

		var name = $('#name').val();
		var friendlyId = $('#friendlyId').val();
		var description = $('#description').val();
		var keywords = $('#keywords').val();
		var callout = $('#callout').val();
		var layout = $('#layout').val();
		var stylesheet = $('#stylesheet').val();
		
		// begin 
		var beginDate = $('#beginDate').val();
		var beginTime = $('#beginTime').val();
		
		var beginDateTime = beginDate + ' ' + beginTime;
		
		// end
		var endDate = $('#endDate').val();
		var endTime = $('#endTime').val();
		
		var endDateTime = endDate + ' ' + endTime;
		
		var timeZone = $('#pageSettingsDialog').attr('data-timezone');
		
		// location
		var location = $('#location').val();
		var latitude = $('#lat').val();
		var longitude = $('#long').val();
		
		
		var checks = $('input.rss:checked');
		var rss = '';
      
		for(var x=0; x<checks.length; x++){
			rss += $(checks[x]).val() + ',';
		}

		if(rss.length>0)rss=rss.substring(0,rss.length-1);
		
		var checks = $('.categories-list input[type=checkbox]:checked');
		var categories = '';
      
		for(var x=0; x<checks.length; x++){
			categories += $(checks[x]).val() + ',';
		}

		if(categories.length>0)categories=categories.substring(0,categories.length-1);

		$.ajax({
			url: 'api/page/'+contentModel.pageUniqId(),
			type: 'POST',
			data: {name:name, friendlyId:friendlyId, description:description, keywords:keywords, 
				   callout:callout, rss:rss, layout:layout, stylesheet:stylesheet, categories:categories,
				   beginDate: beginDateTime, endDate: endDateTime, timeZone: timeZone,
				   location: location, latitude: latitude, longitude: longitude},
			success: function(data){
				message.showMessage('success', $('#msg-settings-saved').val());
				contentModel.updateCategoriesForPage();
			},
			error: function(data){
				message.showMessage('error', $('#msg-settings-error').val());
			}
		});
        
        $('#pageSettingsDialog').modal('hide');

	},

	saveContent:function(i,e){ // saves the content for the page

		message.showMessage('progress', $('#msg-saving').val());
		
		var editor = $('#desc');
		
		// get the content and image from the editor
		var content = respond.Editor.GetContent(editor);
		var image = respond.Editor.GetPrimaryImage(editor);
        
        if(contentModel.previewUrl != ''){
            contentModel.hidePreview();
        }

		$.ajax({
			url: 'api/page/content/'+contentModel.pageUniqId(),
			type: 'POST',
			data: {content:content, status:'publish', image:image},
			success: function(data){
				message.showMessage('success', $('#msg-saved').val());
                
			},
			error: function(data){
				message.showMessage('error', $('#msg-saving-error').val());
			}
		});

	},
    
    saveDraft:function(i,e){ // saves the content for the page

    	message.showMessage('progress', $('#msg-draft-saving').val());

		var editor = $('#desc');
		
		// get the content and image from the editor
		var content = respond.Editor.GetContent(editor);
		var image = respond.Editor.GetPrimaryImage(editor);
        
        if(contentModel.previewUrl != ''){
            contentModel.hidePreview();
        }

		$.ajax({
			url: 'api/page/content/'+contentModel.pageUniqId(),
			type: 'POST',
			data: {content:content, status:'draft', image:image},
			success: function(data){
				message.showMessage('success', $('#msg-draft-saved').val());
                
			},
			error: function(data){
				message.showMessage('error', $('#msg-draft-error').val());
			}
		});

	},

	// updates the page
	updatePage:function(){

		$.ajax({
			url: 'api/page/'+contentModel.pageUniqId(),
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){

				var page = Page.create(data);
				
				// build URL
				var domain = $('body').attr('data-domain');
				var url = 'http://'+domain+'/'+data.Url;
				
				// set fullUrl
				contentModel.fullUrl(url);
				
				// set the prefix for ids created with respond.Editor.js
				respond.prefix = page.friendlyId() + '-';

				contentModel.page(page);
				
				var prefix = '';
				
				if(page.pageTypeId()!='-1'){
					prefix = '../';
				}

				contentModel.toPagePrefix(prefix);
				contentModel.updateCategoriesForPage();
				
				// setup fallback for html5 date
				if (!Modernizr.inputtypes.date) {

					$('input[type=date]').datepicker({
					    dateFormat: 'yy-mm-dd'
					});
					
				}

			}
		});

	},

	// previews the content
	preview:function(){ 
		message.showMessage('progress', $('#msg-saving-draft').val());

		var editor = $('#desc');
		
		// get the content and image from the editor
		var content = respond.Editor.GetContent(editor);

		$.ajax({
			url: 'api/page/content/preview/'+contentModel.pageUniqId(),
			type: 'POST',
			data: {content:content},
			success: function(data){
				message.showMessage('success', $('#msg-draft-saved-preview').val());

				var url = data;
                
                contentModel.previewUrl = data;

		        $('#preview').attr('src', url);
		        $('#editorContainer').hide();
		        $('#actions').hide();
		        $('#previewContainer').fadeIn();
		        $('#previewMessage').slideDown('fast');
			},
			error: function(data){
				message.showMessage('error', $('#msg-draft-error').val());
			}
		});
		
		return false;
	},
    
    // hides the preview
    hidePreview:function(){
        $('#editorContainer').show();
        $('#actions').show();
        $('#previewContainer').hide();
        $('#previewMessage').hide('fast');
        
        contentModel.previewUrl = '';
        
        // clean-up preview directory
        $.ajax({
    		url: 'api/page/content/preview/remove',
			type: 'DELETE',
			data: {},
			success: function(data){}
		});
    },
    
    // updates the images for the site
    updateImages:function(){
        
        contentModel.images.removeAll();
        contentModel.imagesLoading(true);

		$.ajax({
			url: 'api/image/list/all',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
     
                for(x in data){
            
    				var image = {
        			    'filename': data[x].filename,
                        'fullUrl': data[x].fullUrl,
                        'thumbUrl': data[x].thumbUrl,
                        'extension': data[x].extension,
                        'mimetype': data[x].mimetype,
                        'isImage': data[x].isImage,
                        'width': data[x].width,
                        'height': data[x].height
    				};
                
					contentModel.images.push(image); 
				}
                
                
                contentModel.imagesLoading(false);

			}
		});
    },
    
    // sets the image
    setImage:function(o, e){
    	imagesDialog.addImage(o.fullUrl, o.thumbUrl, o.filename);
    },
    
    // update files for the site
    updateFiles:function(){
        
        contentModel.files.removeAll();
        contentModel.filesLoading(true);

    	$.ajax({
			url: 'api/file/list/all',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
     
                for(x in data){
            
    				var file = {
        			    'filename': data[x].filename,
                        'fullUrl': data[x].fullUrl,
                        'thumbUrl': data[x].thumbUrl,
                        'extension': data[x].extension,
                        'mimetype': data[x].mimetype,
                        'isImage': data[x].isImage,
                        'width': data[x].width,
                        'height': data[x].height
    				};
            
					contentModel.files.push(file); 
				}
                
                
                contentModel.filesLoading(false);

			}
		});
    },
    
    // update icons (from json)
    updateIcons:function(){
        
        contentModel.icons.removeAll();
        contentModel.iconsLoading(true);

    	$.ajax({
			url: 'data/icons.json',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
	
                for(x in data.icons){
    
    				var icon = {
        			    'icon': 'fa fa-'+data.icons[x]['id'],
                        'name': data.icons[x]['name']
    				};
                
					contentModel.icons.push(icon); 
				}
                
                
                contentModel.iconsLoading(false);

			}
		});
    },
    
    // add a file
    addFile:function(o, e){
        filesDialog.addFile();
    },
    
    // add an icon
    addIcon: function(o, e){
	    fontAwesomeDialog.addIcon();
    }

}

contentModel.init();