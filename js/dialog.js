// quick implementation of a dialog in jquery
var dialog = {
  
  show:function(reference){
	
	$('.dialog').hide();
  	
    var left = ($(window).width()-80)/2;  // set left

    left -= $('#'+reference).width()/2;
    
    left = Math.ceil(left);

    var top = $(window).scrollTop() + ($(window).height()/2);  // set left
    top -= $('#'+reference).height()/2;
    
    $('#'+reference).css({'top' : (top-20)+'px', 'left' : left+'px'}); // set css

    $('#'+reference).fadeIn('fast'); // show
    
    if($('#'+reference).hasClass('immersive')){
    	var height = $(document).height();
    	$('#overlay').show();
    	$('#overlay').height(height);
    	$('#'+reference+'-Actions').slideDown();
    	
    	$('#'+reference+'-Actions').find('.close-dialog').live('click', function(){
    		dialog.hide(reference);
    		return false;	 	
    	});
    }
    
	$('#'+reference).find('.close-dialog').live('click', function(){
		dialog.hide(reference);
		return false;	 	
	});
  
  },

  recenter:function(reference){
    var left = ($(window).width()-80)/2;  // set left

    left -= $('#'+reference).width()/2;
    
    left = Math.ceil(left);

    var top = $(window).scrollTop() + ($(window).height()/2);  // set left
    top -= $('#'+reference).height()/2;
    
    $('#'+reference).css({'top' : (top-20)+'px', 'left' : left+'px'}); // set css
  },
  
  hide:function(reference){
  	$('#overlay').hide();
    $('#'+reference).fadeOut('fast'); // show
    $('#'+reference+'-Actions').slideUp();
    
    if($('#cropImage').get(0)){
	    $('#cropImage').imgAreaSelect({
	        hide: true
	    });
    }
  }

}