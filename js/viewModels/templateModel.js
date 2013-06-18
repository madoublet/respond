// models the template page
var templateModel = {
    
    template: ko.observable('not-set'),
    templates: ko.observableArray([]),
    templatesLoading: ko.observable(false),
    toBeReset: null,
    toBeApplied: null,

    init:function(){ // initializes the model
        templateModel.updateSite();
    	templateModel.updateTemplates();

		ko.applyBindings(templateModel);  // apply bindings
	},
    
    updateSite:function(){  // updates the page types arr

		$.ajax({
			url: 'api/site/current',
			type: 'GET',
			data: {},
            dataType: 'json',
			success: function(data){
                templateModel.template(data['Template']);
			}
		});

	},

	updateTemplates:function(){  // updates the page types arr

		templateModel.templates.removeAll();
		templateModel.templatesLoading(true);

		$.ajax({
			url: 'api/template/',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){

				for(x in data){

					var template = Template.create(data[x]);

					templateModel.templates.push(template); 

				}

			}
		});

	},
    
    showResetDialog:function(o, e){
        templateModel.toBeReset = o;
        
        $('#resetName').text(o.name());
        
    	$('#resetDialog').modal('show');
    },
    
    showApplyDialog:function(o, e){
        templateModel.toBeApplied = o;
        
        $('#applyName').text(o.name());
        
        $('#applyDialog').modal('show');
    },
    
    resetTemplate:function(o, e){
        message.showMessage('progress', 'Resetting template');
        var template = templateModel.toBeReset.id();
        
        $.ajax({
    		url: 'api/template/reset/' + template,
			type: 'POST',
			data: {},
			success: function(data){
                $('#resetDialog').modal('hide');
    			message.showMessage('success', 'Template successfully reset');
			}
		});
    },
    
    applyTemplate:function(o, e){
        message.showMessage('progress', 'Applying template');
        var template = templateModel.toBeApplied.id();
        
        $.ajax({
        	url: 'api/template/apply/' + template,
			type: 'POST',
			data: {},
			success: function(data){
                $('#applyDialog').modal('hide');
    			message.showMessage('success', 'Template successfully applied');
			}
		});
    }
}

templateModel.init();