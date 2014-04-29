// models the theme page
var themeModel = {
    
    theme: ko.observable('not-set'),
    themes: ko.observableArray([]),
    themesLoading: ko.observable(false),
    toBeReset: null,
    toBeApplied: null,

    init:function(){ // initializes the model
        themeModel.updateSite();
    	themeModel.updateThemes();

		ko.applyBindings(themeModel);  // apply bindings
	},
    
    updateSite:function(){  // updates the page types arr

		$.ajax({
			url: 'api/site/current',
			type: 'GET',
			data: {},
            dataType: 'json',
			success: function(data){
                themeModel.theme(data['Theme']);
			}
		});

	},

	updateThemes:function(){  // updates the page types arr

		themeModel.themes.removeAll();
		themeModel.themesLoading(true);

		$.ajax({
			url: 'api/theme/',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){

				for(x in data){

					var theme = Theme.create(data[x]);

					themeModel.themes.push(theme); 

				}

			}
		});

	},
    
    showResetDialog:function(o, e){
        themeModel.toBeReset = o;
        
        $('#resetName').text(o.name());
        
    	$('#resetDialog').modal('show');
    },
    
    showApplyDialog:function(o, e){
        themeModel.toBeApplied = o;
        
        $('#applyName').text(o.name());
        
        $('#applyDialog').modal('show');
    },
    
    resetTheme:function(o, e){
        message.showMessage('progress', $('#msg-resetting').val());
        var theme = themeModel.toBeReset.id();
        
        $.ajax({
    		url: 'api/theme/reset/' + theme,
			type: 'POST',
			data: {},
			success: function(data){
                $('#resetDialog').modal('hide');
    			message.showMessage('success', $('#msg-reset').val());
			}
		});
    },
    
    applyTheme:function(o, e){
        message.showMessage('progress', $('#msg-applying').val());
        var theme = themeModel.toBeApplied.id();
        
        var el = e.target;
        
        $.ajax({
        	url: 'api/theme/apply/' + theme,
			type: 'POST',
			data: {},
			success: function(data){
                $('#applyDialog').modal('hide');
    			message.showMessage('success', $('#msg-applied').val());
    			
    			themeModel.theme(theme);
			}
		});
    }
}

themeModel.init();