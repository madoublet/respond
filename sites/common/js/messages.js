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
	
    $('#message span').html(text); // set text

    if($('#message').hasClass('visible')){ // transition
    
      $('#message').addClass(type);
      $('#message').fadeIn();
    }
    else{
      message.removeAllClasses();
    
      $('#message').addClass('visible ');
      $('#message').addClass(type);
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
    $('#message').removeClass('error');
    $('#message').removeClass('success');
    $('#message').removeClass('progress');
  },
  
  // gets the current class
  getCurrentClass:function(){
    if($('#message').hasClass('error'))return 'error';
    else if($('#message').hasClass('success'))return 'success';
    else if($('#message').hasClass('progress'))return 'progress';
  },
  
  // hides the message
  hide:function(){
     $('#message').animate({marginTop:'-48px'}, 100);
     $('#message').removeClass('visible');
  }

}
