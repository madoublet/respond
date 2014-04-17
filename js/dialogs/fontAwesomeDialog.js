var fontAwesomeDialog = {

	dialog: null,
	selection: null,

	init:function(){

		fontAwesomeDialog.dialog = $('#fontAwesomeDialog');
        
        $('#selectIcon li').live('click',function(){
            $(this).parent().find('li').removeClass('selected');
            $(this).addClass('selected');
        });

	},
    
    addIcon:function(){
        
        var icon = $('#selectIcon li.selected i').attr('class');
        
        // restore selection
		global.restoreSelection(fontAwesomeDialog.selection);
		
		// set icon
		var html = '<i class="'+icon+'">&nbsp;</i>';
	
		document.execCommand("insertHTML", false, html);

        $('#fontAwesomeDialog').modal('hide'); // show modal
    },

	show:function(){ // shows the dialog
    
    	fontAwesomeDialog.selection = global.saveSelection();
    
        contentModel.updateIcons();
		
	    $('#fontAwesomeDialog').modal('show'); // show modal
	}

}

$(document).ready(function(){
  fontAwesomeDialog.init();
});