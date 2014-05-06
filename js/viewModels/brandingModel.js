// models the branding page
var brandingModel = {
    
    siteUniqId: ko.observable(),
    
    logoUrl: ko.observable(),
    fullLogoUrl: ko.observable(),
    
    iconUrl: ko.observable(),
    iconBg: ko.observable(),
    fullIconUrl: ko.observable(),
    
    payPalLogoUrl: ko.observable(),
    fullPayPalLogoUrl: ko.observable(),
    
    filePrefix: ko.observable(),
    
    images: ko.observableArray([]),
    imagesLoading: ko.observable(false),
    
    newimages: ko.observableArray([]),
    
    type:'logo', // logo, paypal, icon

    init:function(){ // initializes the model
        brandingModel.updateSite();
        
        Dropzone.autoDiscover = false;

        $("#drop").dropzone({ 
            url: "api/file/post",
            success: function(file, response){
                
                var filename = response.filename;
    
                var match = ko.utils.arrayFirst(brandingModel.images(), function (item) {
                                return item.filename === filename; 
                            });
                                
                if (!match) {
                    brandingModel.images.push(response); 
                    brandingModel.newimages.push(response); 
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
                
                // get logo
                brandingModel.logoUrl(data['LogoUrl']);
                brandingModel.fullLogoUrl('sites/'+data['FriendlyId']+'/files/'+data['LogoUrl']);
                
                // get icon
                brandingModel.iconUrl(data['IconUrl']);
				brandingModel.iconBg(data['IconBg']);
                
                if(data['IconUrl'] != null){
                	brandingModel.fullIconUrl('sites/'+data['FriendlyId']+'/files/'+data['IconUrl']);
                }
                else{
	                brandingModel.fullIconUrl('');
                }
                
                // get paypal
                brandingModel.payPalLogoUrl(data['PayPalLogoUrl']);
                
                if(data['PayPalLogoUrl'] != null){
                	brandingModel.fullPayPalLogoUrl('sites/'+data['FriendlyId']+'/files/'+data['PayPalLogoUrl']);
                }
                else{
	                brandingModel.fullPayPalLogoUrl('');
                }
                
                brandingModel.filePrefix('sites/'+data['FriendlyId']+'/files/');
			}
		});

	},
    
    setImage:function(o, e){
  
        var url = o.filename;
        var type = brandingModel.type;
        
        message.showMessage('progress', $('#msg-updating-logo').val());
        
		$.ajax({
			url: 'api/site/branding/image',
			type: 'POST',
			data: {url:url, type:type},
			dataType: 'json',
			success: function(data){
     
				if(type == 'logo'){
                	brandingModel.fullLogoUrl(o.fullUrl);
					brandingModel.logoUrl(o.filename);
                }
                else if(type == 'icon'){
                	brandingModel.fullIconUrl(o.fullUrl);
					brandingModel.iconUrl(o.filename);
                }
                if(type == 'paypal'){
                	brandingModel.fullPayPalLogoUrl(o.fullUrl);
					brandingModel.payPalLogoUrl(o.filename);
                }
                
                message.showMessage('success', $('#msg-branding-updated').val());
                
                $('#imagesDialog').modal('hide');

			}
		});
        
    },
    
    updateIconBg:function(o, e){
  
        var color = $('#iconBg').val();
        
        message.showMessage('progress', $('#msg-updating-logo').val());
        
		$.ajax({
			url: 'api/site/branding/icon/background',
			type: 'POST',
			data: {color:color},
			dataType: 'json',
			success: function(data){
               
                message.showMessage('success', $('#msg-branding-updated').val());
                
                $('#imagesDialog').modal('hide');

			}
		});
        
    },
    
    showImagesDialog:function(o, e){
    
        $('#imagesDialog').modal('show');
        
        brandingModel.images.removeAll();
    	brandingModel.imagesLoading(true);
    	
    	brandingModel.type = $(e.target).attr('data-type');
    	
    	if(brandingModel.type == null || brandingModel.type == ''){
    		brandingModel.type = $(e.target).find('img').attr('data-type');
    	}
    	
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