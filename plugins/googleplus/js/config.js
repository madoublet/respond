// create a namespace for plugins
if(typeof plugin == "undefined" || !plugin) {
	var plugin = {};
}

// the type of plugin must match the JS singleton (e.g. googleplus) name
plugin.googleplus = {

	showUpdate:true, // shows/hides the submit button
	pageUniqId:null,
	pluginUniqId:null,

	// initialize plugin
	init:function(pageUniqId, pluginUniqId){

		plugin.googleplus.pageUniqId = pageUniqId;
		plugin.googleplus.pluginUniqId = pluginUniqId;

		$('#gpsize').val($('#'+plugin.googleplus.pluginUniqId).attr('data-var1'));

	},

	// handles the click of the submit button
	update:function(el){
		
		// an easy way to pass data to your plugin is to set data-[var] attributes
		$('#'+plugin.googleplus.pluginUniqId).attr('data-var1', $('#gpsize').val());

		// show a success message when you are done
		message.showMessage('success', 'Plugin updated successfully');

		// returning true will automatically close the dialog
		return true;
	}

}
