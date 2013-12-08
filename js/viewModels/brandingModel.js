// models the branding page
var brandingModel = {
    
    siteUniqId: ko.observable(),
    logoUrl: ko.observable(),
    fullUrl: ko.observable(),
    filePrefix: ko.observable(),
    
    images: ko.observableArray([]),
    imagesLoading: ko.observable(false),
    
    newimages: ko.observableArray([]),

    init:function(){ // initializes the model
        brandingModel.updateSite();

        $("#drop").dropzone({ 
            url: "api/file/post",
            success: function(file, response){
                var image = jQuery.parseJSON(response);
                
                var filename = image.filename;
    
                var match = ko.utils.arrayFirst(brandingModel.images(), function (item) {
                                return item.filename === filename; 
                            });
                                
                if (!match) {
                    brandingModel.images.push(image); 
                    brandingModel.newimages.push(image); 
                }
            }
            
        });

		ko.applyBindings(brandingModel);  // apply bindings
	},
    
    updateSite:function(){  // updates the site to get the logoUrls

		$.ajax({
			url: 'api/site/current',
			type: 'GET',
			dataType: 'json',
			data: {},
			success: function(data){
                brandingModel.siteUniqId(data['SiteUniqId']);
                brandingModel.logoUrl(data['LogoUrl']);
                brandingModel.fullUrl('sites/'+data['FriendlyId']+'/files/'+data['LogoUrl']);
                brandingModel.filePrefix('sites/'+data['FriendlyId']+'/files/');
			}
		});

	},
    
    applyBranding:function(o, e){
        message.showMessage('progress', 'Updating branding');
        
        $.ajax({
        	url: 'api/site/branding/',
			type: 'POST',
			data: {},
			success: function(data){
    			message.showMessage('success', 'Branding successfully updated');
			}
		});
    },
    
    changeLogo:function(o, e){
  
        var logoUrl = o.filename;
        
        message.showMessage('progress', 'Updating logo...');
        
		$.ajax({
			url: 'api/site/logo/'+brandingModel.siteUniqId(),
			type: 'POST',
			data: {logoUrl:logoUrl},
			dataType: 'json',
			success: function(data){
     
                brandingModel.fullUrl(o.fullUrl);
                brandingModel.logoUrl(o.filename);
                
                message.showMessage('success', 'Logo updated');
                
                $('#imagesDialog').modal('hide');

			}
		});
        
    },
    
    showImagesDialog:function(){
        
        $('#imagesDialog').modal('show');
        
        brandingModel.images.removeAll();
    	brandingModel.imagesLoading(true);

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
                
					brandingModel.images.push(image); 
				}

			}
		});
        
    }
}

brandingModel.init();