// create a namespace for plugins
if(typeof plugin == "undefined" || !plugin) {
	var plugin = {};
}

// the type of plugin must match the JS singleton (e.g. samplepub) name
plugin.samplepub = {

	showUpdate:true, // shows/hides the submit button
	pageUniqId:null,
	pluginUniqId:null,

	// initialize plugin
	init:function(pageUniqId, pluginUniqId){

		plugin.samplepub.pageUniqId = pageUniqId;
		plugin.samplepub.pluginUniqId = pluginUniqId;

		$('#samplepub-var1').val($('#'+plugin.samplepub.pluginUniqId).data('var1'));
		$('#samplepub-var2').val($('#'+plugin.samplepub.pluginUniqId).data('var2'));

	},

	// handles the click of the submit button
	update:function(el){
		
		// an easy way to pass data to your plugin is to set data-[var] attributes
		$('#'+plugin.samplepub.pluginUniqId).data('var1', $('#samplepub-var1').val());
		$('#'+plugin.samplepub.pluginUniqId).data('var2', $('#samplepub-var2').val());

		// show a success message when you are done
		message.showMessage('success', 'Plugin updated successfully');

		// returning true will automatically close the dialog
		return true;
	}

}
