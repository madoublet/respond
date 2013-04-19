var elementConfigDialog = {

	dialog: null,
	moduleId: null,
	
	init:function(){

		elementConfigDialog.dialog = $('#elementConfigDialog');

		// handle update settings
		$('#updateElementConfig').click(function(){

			var moduleId = elementConfigDialog.moduleId;
			var id = jQuery.trim($('#elementId').val());
			var cssClass = jQuery.trim($('#elementCssClass').val());
            var el = $('#'+moduleId);

			if(id!=''){
				$('#'+moduleId).attr('data-id', id);
			}

			$('#'+moduleId).attr('data-cssclass', cssClass);

			
            if(el.hasClass('i')){
                    
                var position = $('#imagePosition').val();
                var href = $('#imageLink').val();
                var imageId = el.find('img').attr('id');
                var src = el.find('img').attr('src');
                var content = el.find('.content').html();
            
                el.removeClass('left').removeClass('right');
                
                if(position!='none'){
                    el.addClass(position);
                }
                
                var html = imagesDialog.getImageHtml(position, imageId, src, href, content);
                
                el.html(html);             
                $('#desc').respondHandleEvents();
            }
            
            $('#elementConfigDialog').modal('hide');
            
		});
		
	},

	show:function(moduleId, id, cssClass){ // shows the dialog
    
        if($('#'+moduleId).hasClass('i')){
            $('.image-config').show();
            
            // get left, right
            if($('#'+moduleId).hasClass('left')){
                $('#imagePosition').val('left');
            }
            else if($('#'+moduleId).hasClass('right')){
                $('#imagePosition').val('right');
            }
            else{
                $('#imagePosition').val('none');
            }
            
            // get url
            var url = $('#'+moduleId).find('img').attr('data-url');
            
            $('#imageLink').val(url);
        }
        else{
            $('.image-config').hide();
        }

		elementConfigDialog.moduleId = moduleId;
		$('#elementId').val(id);
		$('#elementCssClass').val(cssClass);

		$('#elementConfigDialog').modal('show');
	}

}

$(document).ready(function(){
  	elementConfigDialog.init();
});