// create a namespace for plugins
if(typeof plugin == "undefined" || !plugin) {
	var plugin = {};
}

// the type of plugin must match the JS singleton (e.g. poll) name
plugin.poll = {

	showUpdate:true, // shows/hides the submit button
	pageUniqId:null,
	pluginUniqId:null,

	// initialize plugin
	init:function(pageUniqId, pluginUniqId){

		plugin.poll.pageUniqId = pageUniqId;
		plugin.poll.pluginUniqId = pluginUniqId;

		alert('boomtown! pluginUniqId=' + pluginUniqId);

		$('#poll-question').val($('#'+plugin.poll.pluginUniqId).attr('data-question'));
		$('#poll-option1').val($('#'+plugin.poll.pluginUniqId).attr('data-option1'));
		$('#poll-option2').val($('#'+plugin.poll.pluginUniqId).attr('data-option2'));
		$('#poll-option3').val($('#'+plugin.poll.pluginUniqId).attr('data-option3'));
		$('#poll-option4').val($('#'+plugin.poll.pluginUniqId).attr('data-option4'));
		$('#poll-option5').val($('#'+plugin.poll.pluginUniqId).attr('data-option5'));

	},

	// handles the click of the submit button
	update:function(el){

		alert('boom!');
		
		// an easy way to pass data to your plugin is to set data-[var] attributes
		$('#'+plugin.poll.pluginUniqId).attr('data-question', $('#poll-question').val());

		if(jQuery.trim($('#poll-option1').val())!=''){		
			$('#'+plugin.poll.pluginUniqId).attr('data-option1', $('#poll-option1').val());
		}

		if(jQuery.trim($('#poll-option2').val())!=''){	
			$('#'+plugin.poll.pluginUniqId).attr('data-option2', $('#poll-option2').val());
		}

		if(jQuery.trim($('#poll-option3').val())!=''){	
			$('#'+plugin.poll.pluginUniqId).attr('data-option3', $('#poll-option3').val());
		}

		if(jQuery.trim($('#poll-option4').val())!=''){	
			$('#'+plugin.poll.pluginUniqId).attr('data-option4', $('#poll-option4').val());
		}

		if(jQuery.trim($('#poll-option5').val())!=''){	
			$('#'+plugin.poll.pluginUniqId).attr('data-option5', $('#poll-option5').val());
		}

		// show a success message when you are done
		message.showMessage('success', 'Plugin updated successfully');

		// returning true will automatically close the dialog
		return true;
	}

}
