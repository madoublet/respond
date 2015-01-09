// methods for the sidebar theme
var sidebar = {
    
    init:function(){
    
        // toggle nav
        $(document).on('click', '.toggle-nav, .hide-nav', function(){
        	$('body').toggleClass('show-nav'); 
        });
        
        // detect whether the document has been scrolled
        $(window).scroll(function (event) {
		    var position = $(window).scrollTop();
		    
		    if(position == 0){
			    $('body').removeClass('scrolled');
		    }
		    else{
			    $('body').addClass('scrolled');
		    }
		    
		});
      
    }

}

sidebar.init();