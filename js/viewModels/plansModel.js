// models the plans page
var plansModel = {

	plans: ko.observableArray([]), // observables
	plansLoading: ko.observable(false),
	
	mode: 'add', // add or edit
	toBeEdited: null,

	init:function(){ // initializes the model
        
    	plansModel.updatePlans();

		ko.applyBindings(plansModel);  // apply bindings
	},

	updatePlans:function(){  // updates the plans

		plansModel.plans.removeAll();
		plansModel.plansLoading(true);

		$.ajax({
			url: 'api/plan/list',
			type: 'GET',
			data: {},
			success: function(data){

				plansModel.plans(data);

			},
			error: function(data) {
				jQuery('.container').html('<br/>'+data.responseText);
			}
		});

	},
	
	showAddDialog:function(o, e){ // shows a dialog to add a plan
	
		plansModel.mode = 'add';
		$('#addEditDialog').find('.add').show();
		$('#addEditDialog').find('.edit').hide();
	
		$('#plan-id').removeAttr('disabled');
		$('#amount-group').show();
		$('#interval-group').show();
		$('#currency-group').show();
		
		$('#plan-id').val('');
		$('#plan-name').val('');
		$('#plan-amount').val('');
		$('#plan-interval').val('month');
		$('#plan-currency').val('usd');
		$('#plan-trial').val(30);
	
		$('#addEditDialog').modal('show');

		return false;
	},
	
	showEditDialog:function(o, e){ // shows a dialog to add a plan
	
		plansModel.mode = 'edit';
		$('#addEditDialog').find('.edit').show();
		$('#addEditDialog').find('.add').hide();
		
		plansModel.toBeEdited = o;
		
		$('#amount-group').hide();
		$('#interval-group').hide();
		$('#currency-group').hide();
		$('#trial-group').hide();
		
		$('#plan-id').val(o.id);
		$('#plan-id').attr('disabled', 'disabled');
		$('#plan-name').val(o.name);
	
		$('#addEditDialog').modal('show');

		return false;
	},
	
	addPlan:function(o, e){
	
		var id = $('#plan-id').val();
		var name = $('#plan-name').val();
		var amount = $('#plan-amount').val();
		var interval = $('#plan-interval').val();
		var currency = $('#plan-currency').val();
		var trial = $('#plan-trial').val();
	
		if(id=='' || name=='' || amount=='' || interval=='' || currency==''){
			message.showMessage('error', $('#msg-allrequired').val());
			return;
		}
		
		message.showMessage('progress', $('#msg-adding').val());
		
		$.ajax({
			url: 'api/plan/add',
			type: 'POST',
			data: {id:id, name:name, amount:amount, interval:interval, currency:currency, trial:trial},
			success: function(data){
				message.showMessage('success', $('#msg-added').val());

				plansModel.updatePlans();
				
				$('#addEditDialog').modal('hide');
			},
			error: function (data) {
				message.showMessage('error', $('#msg-nopaymentmethod').val());
				$('#addEditDialog').modal('hide');
			}
		});
		
	},
	
	editPlan:function(o, e){
	
		var id = $('#plan-id').val();
		var name = $('#plan-name').val();
		
		if(id=='' || name==''){
			message.showMessage('error', $('#msg-allrequired').val());
			return;
		}
		
		message.showMessage('progress', $('#msg-updating').val());
		
		$.ajax({
			url: 'api/plan/edit',
			type: 'POST',
			data: {id:id, name:name},
			success: function(data){
				message.showMessage('success', $('#msg-updated').val());

				plansModel.updatePlans();
				
				$('#addEditDialog').modal('hide');
			}
		});
		
	}
}

plansModel.init();