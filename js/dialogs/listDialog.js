var listDialog = {

	dialog: null,
	mode: null, 
	moduleId: null,

	init:function(){

		listDialog.dialog = $('#listDialog');

		$('#addList').click(function(){
            
			var editor = $('#desc');
			
			var pageTypeUniqId = $('#listPageType').val();
			
			var uniqId = 'list'+ ($(editor).find('.list').length + 1);
			
			var display = $('#listDisplay').val();
			var label = $('#listPageType option:selected').text();
			label = label.toLowerCase();
			
			if(pageTypeUniqId==-1){
				message.showMessage('error', $('#msg-select-list-error').val());
				return;
			}
			
			var html = '<div id="'+uniqId+'" data-display="'+display+'" data-type="'+pageTypeUniqId+'" class="list"' +
							' data-length="'+$('#listLength').val() + '"' +
							' data-orderby="'+$('#listOrderBy').val() + '"' +
							' data-category="'+$('#listCategory').val() + '"' +
							' data-pageresults="'+$('#listPageResults').is(':checked') + '"' +
							' data-desclength="'+$('#listDescLength').val() + '"' +
							' data-label="' + 
							label +
							'">' + 
							editorDefaults.elementMenuList +
							'<div class="title"><i class="fa fa-bars"></i> List ' + 
							label + 
							'</div></div>';
			
			$(editor).respondAppend(
				html
			);
			
			$(editor).respondHandleEvents();
			
			$('#listDialog').modal('hide');
		});


		$('#updateList').on('click', function(){
		  
			var pageTypeUniqId = listDialog.pageTypeUniqId;
			var moduleId = listDialog.moduleId;
			
			var editor = $('#desc');
			
			var desclength = parseInt($('#listDescLength').val());
			
			$('div#'+moduleId+'.list').attr('data-display', $('#listDisplay').val());
			$('div#'+moduleId+'.list').attr('data-length', $('#listLength').val());
			$('div#'+moduleId+'.list').attr('data-orderby', $('#listOrderBy').val());
			$('div#'+moduleId+'.list').attr('data-category', $('#listCategory').val());
			$('div#'+moduleId+'.list').attr('data-pageresults', $('#listPageResults').val());
			$('div#'+moduleId+'.list').attr('data-desclength', desclength);
			
			$('#listDialog').modal('hide');
		});
			
		// retrieves new categories for page type
		$('#listPageType').on('change', function(){
			var pageTypeUniqId = $(this).val();
		
			contentModel.updateCategoriesWithPageTypeUniqId(pageTypeUniqId);
		});
	},

	show:function(mode, moduleId){ // shows the dialog

		listDialog.mode = mode;
		listDialog.moduleId = moduleId;

	    if(mode=='add'){

			$('#listDialog .add').show();  // show/hide
			$('#listDialog .edit').hide();
			
			$('#listPageTypeBlock').show();
			
			$('#showSelectOptions').show();
			$('#selectList li').removeClass('selected');
			$('#showCategoryOptions').hide();
			$('#showCategoryPageTypes').show();
			
			$("#listPageType")[0].selectedIndex = 0;
			
			var pageTypeUniqId = $("#listPageType").val();
			
			contentModel.updateCategoriesWithPageTypeUniqId(pageTypeUniqId);
			
			$('#listLength').val('10');   // set initial values
			$('#listCategory').val('-1');
			$('#listOrderBy').val('Name');
			$('#listPageResults').val('false');
			$('#listDescLength').val(250);
			$('#listFeaturedOnly').val(0);
			
			listDialog.pageTypeUniqId = -1;
			
			$('#listDialog').modal('show'); // show modal
	    }
	    else{
			$('#listDialog .edit').show();  // show/hide
			$('#listDialog .add').hide();
			
			$('#listPageTypeBlock').hide();
			
			var node = $('div#'+listDialog.moduleId+'.list');   // get reference to list
			var display = $(node).attr('data-display');
			var type = $(node).attr('data-type');
			var category = $(node).attr('data-category')
			
			function setCategory(){
			  $('#listCategory').val(category);
			}
			
			contentModel.updateCategoriesWithPageTypeUniqId(type, setCategory);
			
			var label = $(node).attr('data-label');
			var length = $(node).attr('data-length');
			var orderby = $(node).attr('data-orderby');
			
			var pageresults = $(node).attr('data-pageresults');
			var desclength = $(node).attr('data-desclength');
			
			if(desclength==undefined){
				desclength = 250;
			}
			
			$('#listDisplay').val(display);   // set current values
			$('#listLength').val(length); 
			$('#listOrderBy').val(orderby); 
			$('#listPageResults').val(pageresults);
			$('#listDescLength').val(desclength);
			
			listDialog.pageTypeUniqId = type;
			
			$('#listDialog').modal('show'); // show modal
	    }
	}

}

$(document).ready(function(){
	listDialog.init();
});