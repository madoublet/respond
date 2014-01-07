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
        
		message.showMessage('progress', $('#msg-updating').val());
        
        var name = $('#name').val();
        var domain = $('#domain').val();
        var primaryEmail = $('#primaryEmail').val();
        var timeZone = $('#timeZone').val();
        var language = $('#language').val();
        var analyticsId = $('#analyticsId').val();
        var facebookAppId = $('#facebookAppId').val();
        
        // clean up domain
        domain = global.replaceAll(domain, 'www.', '');
        domain = global.replaceAll(domain, 'http://', '');
        domain = global.replaceAll(domain, '//', '');
        
        if(domain.charAt(domain.length-1) == '/') {
		    domain = domain.slice(0, -1);
		}
		
		settingsModel.site().domain(domain);
		
        $.ajax({
            url: 'api/site/' + o.siteUniqId(),
			type: 'POST',
			data: {name: name, domain: domain, primaryEmail: primaryEmail, timeZone: timeZone, language: language, analyticsId: analyticsId, facebookAppId: facebookAppId},
			success: function(data){
    			message.showMessage('success', $('#msg-updated').val());
			},
			error: function(data){
				message.showMessage('error', $('#msg-updating-error').val());
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
            message.showMessage('error', $('#msg-name-content-error').val());
            return;
        }
        
        message.showMessage('progress', $('#msg-generating').val());
   
        $.ajax({
            url: 'api/site/verification/generate',
    		type: 'POST',
			data: {name: name, content: content},
			dataType: 'json',
			success: function(data){
    			message.showMessage('success', $('#msg-generated').val());
                $('#verificationDialog').modal('hide');
			},
			error: function(data){
				message.showMessage('error', $('#msg-generating-error').val());
			}
		});
    }
}

settingsModel.init();