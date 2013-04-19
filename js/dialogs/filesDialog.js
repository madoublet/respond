var filesDialog = {

	dialog: null,

	init:function(){

		filesDialog.dialog = $('#filesDialog');
        
        $('#selectFile li').live('click',function(){
            $(this).parent().find('li').removeClass('selected');
            $(this).addClass('selected');
        });

	},
    
    addFile:function(){
        
        var file = $('#selectFile li.selected a');

        if(file.length==0){
            message.showMessage('error', 'Please select a file');
            return;
        }
        
        var filename = $(file).attr('data-filename');
        
        $('#desc').respondAppend(
          '<div class="file"><div><em>'+filename+'</em><input type="text" value="" spellcheck="false" maxlength="256" placeholder="Description for the file"></div><span class="marker icon-file-alt" title="Module"></span><a class="remove" href="#"></a></div>'
        );

        $('#filesDialog').modal('hide'); // show modal
    },

	show:function(){ // shows the dialog
    
        contentModel.updateFiles();
		
	    $('#filesDialog').modal('show'); // show modal
	}

}

$(document).ready(function(){
  filesDialog.init();
});