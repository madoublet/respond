var elementConfigDialog = {

	dialog: null,
	moduleId: null,
	columns: null,
	rows: null,
	
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
            if(el.hasClass('table')){
	            
	            var columns = $('#tableColumns').val();
	            var rows = $('#tableRows').val();
	            
	            // handle columns
	            if(columns > elementConfigDialog.columns){ // add columns
		            
		            var toBeAdded = columns - elementConfigDialog.columns;
		            
		            var table = $(el).find('table');
					var trs = table.find('tr');
			
					// walk through table
					for(var x=0; x<trs.length; x++){
						
						// add columns
						for(var y=0; y<toBeAdded; y++){
							if(trs[x].parentNode.nodeName=='THEAD'){
								$(trs[x]).append('<th contentEditable="true"></th>');
							}
							else{
								$(trs[x]).append('<td contentEditable="true"></td>');
							}
						}
					}
			
					var n_cols = columns;
					
					table.removeClass('col-'+elementConfigDialog.columns);
					table.addClass('col-'+(n_cols));
					table.attr('data-columns', (n_cols));
		            
	            }
	            else if(columns < elementConfigDialog.columns){ // remove columns
	            
	            	var toBeRemoved = elementConfigDialog.columns - columns;
		            
		            var table = $(el).find('table');
					var trs = table.find('tr');
			
					// walk through table
					for(var x=0; x<trs.length; x++){
						
						// add columns
						for(y=0; y<toBeRemoved; y++){
							if(trs[x].parentNode.nodeName=='THEAD'){
								$(trs[x]).find('th:last-child').remove();
							}
							else{
								$(trs[x]).find('td:last-child').remove();
							}
						}
					}
			
					var n_cols = columns;
					
					table.removeClass('col-'+elementConfigDialog.columns);
					table.addClass('col-'+(n_cols));
					table.attr('data-columns', (n_cols));
	            
	            }
	            
	            // handle rows
	            if(rows > elementConfigDialog.rows){ // add columns
		            
		            var toBeAdded = rows - elementConfigDialog.rows;
		            
		            var table = $(el).find('table');
					
					// add rows
					for(y=0; y<toBeAdded; y++){
						var html = '<tr>';

						for(x=0; x<columns; x++){
							html += '<td contentEditable="true"></td>';
						}
				
						html += '</tr>';
				
						$(table).find('tbody').append(html);
					}
		            
	            }
	            else if(rows < elementConfigDialog.rows){ // remove columns
	            
	            	var toBeRemoved = elementConfigDialog.rows - rows;
		            
		            var table = $(el).find('table');
		            
					// remove rows
					for(y=0; y<toBeRemoved; y++){
						table.find('tbody tr:last-child').remove();
					}

	            }
	            
            }
            
            $('#elementConfigDialog').modal('hide');
            
		});
		
	},

	show:function(moduleId, id, cssClass){ // shows the dialog
	
        $('.image-config').hide();
        $('.table-config').hide();
    
        if($('#'+moduleId).hasClass('i')){
            $('.table-config').hide();
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
        
        if($('#'+moduleId).hasClass('table')){
            $('.image-config').hide();
            $('.table-config').show();
            
            elementConfigDialog.columns = parseInt($('#'+moduleId).find('table').attr('data-columns'));
            elementConfigDialog.rows = $('#'+moduleId).find('tbody tr').length;
            
            $('#tableColumns').val(elementConfigDialog.columns);
            $('#tableRows').val(elementConfigDialog.rows);
            
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