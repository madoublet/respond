// models the switch page
var switchModel = {

	sites: ko.observableArray([]), // observables
	sitesLoading: ko.observable(false),

	init:function(){ // initializes the model
        
    	switchModel.updateSites();

		ko.applyBindings(switchModel);  // apply bindings
	},

	updateSites:function(){  // updates the sites arr

		switchModel.sites.removeAll();
		switchModel.sitesLoading(true);

		$.ajax({
			url: 'api/site/list/all',
			type: 'GET',
			data: {},
			success: function(data){

				for(x in data){

					var site = Site.create(data[x]);

					switchModel.sites.push(site); 

				}

			}
		});

	},
    
    switchSite:function(o, e){
        
        message.showMessage('progress', 'Switching site...');
        
        $.ajax({
    		url: 'api/site/switch',
			type: 'POST',
			data: {siteUniqId:o.siteUniqId()},
			success: function(data){

		        message.showMessage('success', 'Switch successful...');
			}
		});
        
    }
}

switchModel.init();