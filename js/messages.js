/*var example = {

  init:function(){
    
    $('#show').click(function(){
      message.showMessage('progress', 'Something is loading, please wait.');
    });
    
    $('#switchToSuccess').click(function(){
       message.showMessage('success', 'Woo hoo! You accomplished your task.');
    });
    
    $('#switchToError').click(function(){
      message.showMessage('error', 'Uh oh! Something is not right. Check the form.');
    });
    
  }
}*/

// handles messaging
var message = {

  // shows the progress message
  showMessage:function(type, text){
  
  	// create message if it does note exist
  	if($('#message').length == 0){
	  	$('body').append('<p id="message"><span></span><a class="close" href="#"></a></p>');
	}
  
    $('#message span').html(text); // set text
    
    // center the message
    var calc = $(window).width()/2;  // set left
    calc -= ($('#message').width()/2);
    calc = calc + 'px';
    
    $('#message').css({left:calc});
  
    if($('#message').hasClass('visible')){ // transition
    
      $('#message').addClass('message-'+type);
      $('#message').fadeIn();
    }
    else{
      message.removeAllClasses();
    
      $('#message').addClass('visible ');
      $('#message').addClass('message-'+type);
      $('#message').animate({marginTop:'0'}, 200);
    }
    
    if(type=='success'){ // for success messages, we want to fade it out
      setTimeout('message.hide()', 2000);
    }
	
	if(type=='error'){ // for error messages, we want to fade it out, but a little slower
      setTimeout('message.hide()', 3000);
    }
    
    $('#message a.close').click(function(){
      $('#message').fadeOut();
      $('#message').removeClass('visible');
      return false;
    });
 
  },
  
  // removes all display clases
  removeAllClasses:function(){
    $('#message').removeClass('message-error');
    $('#message').removeClass('message-success');
    $('#message').removeClass('message-progress');
  },
  
  // gets the current class
  getCurrentClass:function(){
    if($('#message').hasClass('message-error'))return 'error';
    else if($('#message').hasClass('message-success'))return 'success';
    else if($('#message').hasClass('message-progress'))return 'progress';
  },
  
  // hides the message
  hide:function(){
     $('#message').animate({marginTop:'-46px'}, 100);
     $('#message').removeClass('visible');
  }

}
