// models the admin page
var adminModel = {

	sites: ko.observableArray([]), // observables
	sitesLoading: ko.observable(false),
	
	timeZone: ko.observable('America/Chicago'),

	init:function(){ // initializes the model
        
    	adminModel.updateSites();
    	
    	var tz = jstz.determine();
        adminModel.timeZone(tz.name());
        
        $('#name').keyup(function(){
    		var keyed = $(this).val().toLowerCase().replace(/[^a-zA-Z 0-9]+/g,'').replace(/\s/g, '');
			keyed = keyed.substring(0,25);
			$('#tempUrl').removeClass('temp');
			$('#tempUrl').html(keyed);
			$('#friendlyId').val(keyed);
		});

		ko.applyBindings(adminModel);  // apply bindings
	},

	updateSites:function(){  // updates the sites arr

		adminModel.sites.removeAll();
		adminModel.sitesLoading(true);

		$.ajax({
			url: 'api/site/list/extended',
			type: 'GET',
			data: {},
			success: function(data){

				adminModel.sites(data); 

			}
		});

	},
    
    switchSite:function(o, e){
        
        message.showMessage('progress', $('#msg-switching').val());
        
        $.ajax({
    		url: 'api/site/switch',
			type: 'POST',
			data: {siteUniqId:o.siteUniqId},
			success: function(data){

		        message.showMessage('success', $('#msg-switched').val());
			}
		});
        
    },
    
    showAddDialog:function(o, e){ // shows a dialog to add a site
		$('#name').val('');
	
		$('#addDialog').modal('show');

		return false;
	},
	
	addSite:function(o, e){
	
		var friendlyId = $('#friendlyId').val();
        var name = $.trim($('#name').val());
        var passcode = $.trim($('#passcode').val());
        var timeZone = $('#timeZone').val();
        
        if(name=='' || friendlyId=='' || passcode==''){
			message.showMessage('error', $('#msg-required').val());
			return;
		}
		
		message.showMessage('progress', $('#msg-adding').val());
        
        $.ajax({
    		url: 'api/site/create',
			type: 'POST',
			data: {friendlyId: friendlyId, name: name, passcode: passcode, timeZone: timeZone},
			success: function(data){
				$('#addDialog').modal('hide');
				adminModel.updateSites();
				message.showMessage('success', $('#msg-added').val());
			}
		});
        
    }
}

adminModel.init();