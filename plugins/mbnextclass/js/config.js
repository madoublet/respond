// create a namespace for plugins
if(typeof plugin == "undefined" || !plugin) {
	var plugin = {};
}

// the type of plugin must match the JS singleton (e.g. mbnextclass) name
plugin.mbnextclass = {

	showUpdate:true, // shows/hides the submit button
	pageUniqId:null,
	pluginUniqId:null,

	// initialize plugin
	init:function(pageUniqId, pluginUniqId){

		plugin.mbnextclass.pageUniqId = pageUniqId;
		plugin.mbnextclass.pluginUniqId = pluginUniqId;

		$('#mbnextclass-sourcename').val($('#'+plugin.mbnextclass.pluginUniqId).attr('data-sourcename'));
		$('#mbnextclass-password').val($('#'+plugin.mbnextclass.pluginUniqId).attr('data-password'));
		$('#mbnextclass-siteid').val($('#'+plugin.mbnextclass.pluginUniqId).attr('data-siteid'));

	},

	// handles the click of the submit button
	update:function(el){
		
		// an easy way to pass data to your plugin is to set data-[var] attributes
		$('#'+plugin.mbnextclass.pluginUniqId).attr('data-sourcename', $('#mbnextclass-sourcename').val());
		$('#'+plugin.mbnextclass.pluginUniqId).attr('data-password', $('#mbnextclass-password').val());
		$('#'+plugin.mbnextclass.pluginUniqId).attr('data-siteid', $('#mbnextclass-siteid').val());

		// show a success message when you are done
		message.showMessage('success', 'Plugin updated successfully');

		// returning true will automatically close the dialog
		return true;
	}

}
