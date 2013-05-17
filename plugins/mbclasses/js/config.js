// create a namespace for plugins
if(typeof plugin == "undefined" || !plugin) {
	var plugin = {};
}

// the type of plugin must match the JS singleton (e.g. mbclasses) name
plugin.mbclasses = {

	showUpdate:true, // shows/hides the submit button
	pageUniqId:null,
	pluginUniqId:null,

	// initialize plugin
	init:function(pageUniqId, pluginUniqId){

		plugin.mbclasses.pageUniqId = pageUniqId;
		plugin.mbclasses.pluginUniqId = pluginUniqId;

		$('#mbclasses-sourcename').val($('#'+plugin.mbclasses.pluginUniqId).attr('data-sourcename'));
		$('#mbclasses-password').val($('#'+plugin.mbclasses.pluginUniqId).attr('data-password'));
		$('#mbclasses-siteid').val($('#'+plugin.mbclasses.pluginUniqId).attr('data-siteid'));

	},

	// handles the click of the submit button
	update:function(el){
		
		// an easy way to pass data to your plugin is to set data-[var] attributes
		$('#'+plugin.mbclasses.pluginUniqId).attr('data-sourcename', $('#mbclasses-sourcename').val());
		$('#'+plugin.mbclasses.pluginUniqId).attr('data-password', $('#mbclasses-password').val());
		$('#'+plugin.mbclasses.pluginUniqId).attr('data-siteid', $('#mbclasses-siteid').val());

		// show a success message when you are done
		message.showMessage('success', 'Plugin updated successfully');

		// returning true will automatically close the dialog
		return true;
	}

}
