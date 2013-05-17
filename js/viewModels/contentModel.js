// models the content page
var contentModel = {

	pageUniqId: ko.observable(''),
	page: ko.observable(null),
	toPagePrefix: ko.observable(''),

	content: ko.observable(''),
	contentLoading: ko.observable(false),
	pageTypes: ko.observableArray([]),

	pages: ko.observableArray([]),
	pagesLoading: ko.observable(false),

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
    
    previewUrl: '',

	init:function(){ // initializes the model
		var p = global.getQueryStringByName('p');

		contentModel.pageUniqId(p);

		contentModel.updateContent();
		contentModel.updatePage();
		contentModel.updatePageTypes();

		ko.applyBindings(contentModel);  // apply bindings
	},

	updateContent:function(){ // retrieves the content for the page
		
		contentModel.contentLoading(true);

		$.ajax({
			url: './api/page/content/'+contentModel.pageUniqId(),
			type: 'GET',
			data: {},
			success: function(data){
				contentModel.content(data);
				contentModel.contentLoading(false);
                
                // setup editor
    			$('#desc').respondEdit();
                
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

	updatePageTypes:function(){  // updates the page types arr

		contentModel.pageTypes.removeAll();

		$.ajax({
			url: './api/pagetype/list/all',
			type: 'GET',
			data: {},
			success: function(data){

				for(x in data){

					var pageType = PageType.create(data[x]);

					contentModel.pageTypes.push(pageType); 

				}

			}
		}, 'json');

	},

	updatePages:function(){  // updates the pages arr

		contentModel.pages.removeAll();
		contentModel.pagesLoading(true);

		$.ajax({
			url: './api/page/list/all',
			type: 'GET',
			data: {},
			success: function(data){

				for(x in data){
                    console.log(data[x]);
					var page = Page.create(data[x]);
					contentModel.pages.push(page); 
				}

				contentModel.pagesLoading(false);

			}
		}, 'json');

	},

	updatePlugins:function(){ // gets the plugins for the system

		contentModel.pluginsLoading(true);

		$.ajax({
			url: './api/plugin/',
			type: 'GET',
			data: {},
			success: function(data){
				contentModel.plugins(data);
				contentModel.pluginsLoading(false);
			}
		}, 'json');
	},

	updateStylesheets:function(){ // gets the stylesheets for the current template

		contentModel.stylesheetsLoading(true);

		$.ajax({
			url: './api/template/stylesheets/',
			type: 'GET',
			data: {},
			success: function(data){
				contentModel.stylesheets(data);
				contentModel.stylesheetsLoading(false);
			}
		}, 'json');
	},

	updateLayouts:function(){ // gets the layouts for the current template

		contentModel.layoutsLoading(true);

		$.ajax({
			url: './api/template/layouts/',
			type: 'GET',
			data: {},
			success: function(data){
				contentModel.layouts(data);
				contentModel.layoutsLoading(false);
			}
		}, 'json');
	},

	saveSettings:function(i,e){ // saves the settings for the page

		message.showMessage('progress', 'Saving settings...');

		var name = $('#name').val();
		var friendlyId = $('#friendlyId').val();
		var description = $('#description').val();
		var keywords = $('#keywords').val();
		var callout = $('#callout').val();
		var layout = $('#layout').val();
		var stylesheet = $('#stylesheet').val();

		var checks = $('input.rss:checked');
		var rss = '';
      
		for(var x=0; x<checks.length; x++){
			rss += $(checks[x]).val() + ',';
		}

		if(rss.length>0)rss=rss.substring(0,rss.length-1);

		$.ajax({
			url: './api/page/'+contentModel.pageUniqId(),
			type: 'POST',
			data: {name:name, friendlyId:friendlyId, description:description, keywords:keywords, 
				   callout:callout, rss:rss, layout:layout, stylesheet:stylesheet},
			success: function(data){
				message.showMessage('success', 'Content saved');
			},
			error: function(data){
				message.showMessage('error', 'There was a problem saving the content, please try again');
			}
		});
        
        $('#pageSettingsDialog').modal('hide');

	},

	saveContent:function(i,e){ // saves the content for the page

		message.showMessage('progress', 'Saving content...');

		var content = $('#desc').respondHtml();
		var image = $('#desc').respondGetPrimaryImage();
        
        if(contentModel.previewUrl != ''){
            contentModel.hidePreview();
        }

		$.ajax({
			url: './api/page/content/'+contentModel.pageUniqId(),
			type: 'POST',
			data: {content:content, status:'publish', image:image},
			success: function(data){
				message.showMessage('success', 'Content saved');
                
			},
			error: function(data){
				message.showMessage('error', 'There was a problem saving the content, please try again');
			}
		});

	},
    
    saveDraft:function(i,e){ // saves the content for the page

    	message.showMessage('progress', 'Saving content...');

		var content = $('#desc').respondHtml();
		var image = $('#desc').respondGetPrimaryImage();
        
        if(contentModel.previewUrl != ''){
            contentModel.hidePreview();
        }

		$.ajax({
			url: './api/page/content/'+contentModel.pageUniqId(),
			type: 'POST',
			data: {content:content, status:'draft', image:image},
			success: function(data){
				message.showMessage('success', 'Content saved');
                
			},
			error: function(data){
				message.showMessage('error', 'There was a problem saving the content, please try again');
			}
		});

	},

	updatePage:function(){ // grabs the content 

		$.ajax({
			url: './api/page/'+contentModel.pageUniqId(),
			type: 'GET',
			data: {},
			success: function(data){

				var page = Page.create(data);

				contentModel.page(page);

				var prefix = '';

				if(page.pageTypeId!='-1'){
					prefix = '../';
				}

				contentModel.toPagePrefix(prefix);

			}
		}, 'json');

	},

	preview:function(){ // previews the content
		message.showMessage('progress', 'Saving draft...');

		var content = $('#desc').respondHtml();

		$.ajax({
			url: './api/page/content/preview/'+contentModel.pageUniqId(),
			type: 'POST',
			data: {content:content},
			success: function(data){
				message.showMessage('success', 'Content saved, launching preview');

				var url = data;
                
                contentModel.previewUrl = data;

		        $('#preview').attr('src', url);
		        $('#editorContainer').hide();
		        $('#actions').hide();
		        $('#previewContainer').fadeIn();
		        $('#previewMessage').slideDown('fast');
			},
			error: function(data){
				message.showMessage('error', 'There was a problem saving the content, please try again');
			}
		});
	},
    
    hidePreview:function(){
        $('#editorContainer').show();
        $('#actions').show();
        $('#previewContainer').hide();
        $('#previewMessage').hide('fast');
        
        contentModel.previewUrl = '';
        
        // clean-up preview directory
        $.ajax({
    		url: './api/page/content/preview/remove',
			type: 'DELETE',
			data: {},
			success: function(data){}
		});
    },
    
    updateImages:function(){
        
        contentModel.images.removeAll();
        contentModel.imagesLoading(true);

		$.ajax({
			url: './api/image/list/all',
			type: 'GET',
			data: {},
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
    				}
                
            
					contentModel.images.push(image); 
				}
                
                
                contentModel.imagesLoading(false);

			}
		}, 'json');
    },
    
    addImage:function(o, e){
        imagesDialog.addImage(o.fullUrl, o.thumbUrl, o.filename);
    },
    
    updateFiles:function(){
        
        contentModel.files.removeAll();
        contentModel.filesLoading(true);

    	$.ajax({
			url: './api/file/list/all',
			type: 'GET',
			data: {},
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
    				}
                
            
					contentModel.files.push(file); 
				}
                
                
                contentModel.filesLoading(false);

			}
		}, 'json');
    },
    
    addFile:function(o, e){
        filesDialog.addFile();
    }

}

contentModel.init();