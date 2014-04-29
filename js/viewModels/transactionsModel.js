// models the transactions page
var transactionsModel = {

	transactions: ko.observableArray([]),
	transactionsLoading: ko.observable(true),
	
	toBeRemoved: null,
    
	init:function(){ // initializes the model
	
		transactionsModel.updateTransactions();	
	
		ko.applyBindings(transactionsModel);  // apply bindings
	},
 
	updateTransactions:function(){

		transactionsModel.transactions.removeAll();
		transactionsModel.transactionsLoading(true);

		$.ajax({
			url: 'api/transaction/list/',
			type: 'GET',
			data: {},
			dataType: 'json',
			success: function(data){

				for(x in data){

					var transaction = Transaction.create(data[x]);

					transactionsModel.transactions.push(transaction); 
    	
				}

				transactionsModel.transactionsLoading(false);

			}
		});

	}

}

transactionsModel.init();
