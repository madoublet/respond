// models the settings page
var settingsModel = {
    
    site: ko.observable(''),
    siteMap: ko.observable(''),
    
    init:function(){ // initializes the model
        settingsModel.updateSite();

		ko.applyBindings(settingsModel);  // apply bindings
	},
    
    updateSite:function(o){
        
        $.ajax({
    		url: 'api/site/current',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){
                
                var site = Site.create(data);
                
                settingsModel.siteMap('http://'+site.domain()+'/sitemap.xml');
                
                settingsModel.site(site);
			}
		});
        
    },
    
    save:function(o, e){
        
		message.showMessage('progress', 'Updating settings...');
        
        var name = $('#name').val();
        var domain = $('#domain').val();
        var primaryEmail = $('#primaryEmail').val();
        var timeZone = $('#timeZone').val();
        var analyticsId = $('#analyticsId').val();
        var facebookAppId = $('#facebookAppId').val();
        
        $.ajax({
            url: 'api/site/' + o.siteUniqId(),
			type: 'POST',
			data: {name: name, domain: domain, primaryEmail: primaryEmail, timeZone: timeZone, analyticsId: analyticsId, facebookAppId: facebookAppId},
			success: function(data){
    			message.showMessage('success', 'Settings saved');
			},
			error: function(data){
				message.showMessage('error', 'There was a problem saving the settings, please try again');
			}
		});
        
    },
    
    showVerificationDialog:function(o, e){
        
        $('#fileName').val('');
        $('#fileContent').val('');
        $('#verificationDialog').modal('show');
        
    },
    
    generateVerification:function(o, e){
        
        var name = $('#fileName').val();
        var content = $('#fileContent').val();
        
        if(name=='' || content==''){
            message.showMessage('error', 'The name and content are required');
            return;
        }
        
        message.showMessage('progress', 'Generating file...')
   
        $.ajax({
            url: 'api/site/verification/generate',
    		type: 'POST',
			data: {name: name, content: content},
			dataType: 'json',
			success: function(data){
    			message.showMessage('success', 'Verification file generated');
                $('#verificationDialog').modal('hide');
			},
			error: function(data){
				message.showMessage('error', 'There was a problem generating the file, please try again');
			}
		});
    }
}

settingsModel.init();