// create a namespace for plugins
if(typeof plugin == "undefined" || !plugin) {
	var plugin = {};
}

// the type of plugin must match the JS singleton (e.g. samplert) name
plugin.samplert = {

	showUpdate:true, // shows/hides the submit button
	pageUniqId:null,
	pluginUniqId:null,

	// initialize plugin
	init:function(pageUniqId, pluginUniqId){

		plugin.samplert.pageUniqId = pageUniqId;
		plugin.samplert.pluginUniqId = pluginUniqId;

		$('#samplert-var1').val($('#'+plugin.samplert.pluginUniqId).data('var1'));
		$('#samplert-var2').val($('#'+plugin.samplert.pluginUniqId).data('var2'));

	},

	// handles the click of the submit button
	update:function(el){
		
		// an easy way to pass data to your plugin is to set data-[var] attributes
		$('#'+plugin.samplert.pluginUniqId).data('var1', $('#samplert-var1').val());
		$('#'+plugin.samplert.pluginUniqId).data('var2', $('#samplert-var2').val());

		// show a success message when you are done
		message.showMessage('success', 'Plugin updated successfully');

		// returning true will automatically close the dialog
		return true;
	}

}
