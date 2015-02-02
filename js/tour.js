var tour = {
	
	intro:function(){
		
		// setup a tour
		var tour = new Shepherd.Tour({
		  defaults: {
		    classes: 'shephed-element',
		    scrollTo: true
		  }
		});
		
		tour.addStep('step1', {
		  text: i18n.t('tour_intro_step1'),
		  attachTo: {element: 'nav h1', on: 'bottom'},
		  classes: 'no-arrow',
		  buttons: [
		    {
		      text: i18n.t('Exit'),
		      classes: 'shepherd-button-secondary',
		      action: function() {
		        return tour.hide();
		      }
		    },
		    {
		      text: i18n.t('Next'),
		      classes: 'shepherd-button-primary',
		      action: function() {
		        return tour.next();
		      }
		    }
		  ]
		});
		
		tour.addStep('step2', {
		  text: i18n.t('tour_intro_step2'),
		  attachTo: '#listItem-0 h2 a right',
		  classes: '',
		  buttons: [
		    {
		      text: i18n.t('Exit'),
		      classes: 'shepherd-button-secondary',
		      action: function() {
		        return tour.hide();
		      }
		    },
		    {
		      text: i18n.t('Next'),
		      classes: 'shepherd-button-primary',
		      action: function() {
		        return tour.next();
		      }
		    }
		  ]
		});
		
		tour.addStep('step3', {
		  text: i18n.t('tour_intro_step3'),
		  attachTo: '#add-page left',
		  classes: '',
		  buttons: [
		    {
		      text: i18n.t('Exit'),
		      classes: 'shepherd-button-secondary',
		      action: function() {
		        return tour.hide();
		      }
		    },
		    {
		      text: i18n.t('Next'),
		      classes: 'shepherd-button-primary',
		      action: function() {
		        return tour.next();
		      }
		    }
		  ],
		  tetherOptions:{
			  offset: '-5px 0',
			  targetOffset: '20px 0' 
		  }
		});
		
		tour.addStep('step4', {
		  text: i18n.t('tour_intro_step4'),
		  attachTo: 'nav .show-menu right',
		  classes: '',
		  buttons: [
		    {
		      text: i18n.t('Exit'),
		      classes: 'shepherd-button-secondary',
		      action: function() {
		        return tour.hide();
		      }
		    },
		    {
		      text: i18n.t('Next'),
		      classes: 'shepherd-button-primary',
		      action: function() {
			    $('body').toggleClass('show-nav');   
		        return tour.next();
		      }
		    }
		  ],
		  tetherOptions:{
			  targetOffset: '20px 0' 
		  }
		});
		
		tour.addStep('step5', {
		  text: i18n.t('tour_intro_step5'),
		  attachTo: '#advanced-configurations right',
		  classes: 'pull-front',
		  buttons: [
		    {
		      text: i18n.t('Exit'),
		      classes: 'shepherd-button-secondary',
		      action: function() {
		        return tour.hide();
		      }
		    },
		    {
		      text: i18n.t('Next'),
		      classes: 'shepherd-button-primary',
		      action: function() {
			    $('body').toggleClass('show-nav');   
		        return tour.next();
		      }
		    }
		  ],
		  tetherOptions:{
			  targetOffset: '20px 200px' 
		  }
		});
		
		tour.addStep('step6', {
		  text: i18n.t('tour_intro_step6'),
		  attachTo: '#listItem-0 h2 a right',
		  classes: '',
		  buttons: [
		    {
		      text: i18n.t('Get Started'),
		      classes: 'shepherd-button-primary',
		      action: function() {
		        return tour.hide();
		      }
		    }
		  ]
		});
		
		tour.start();
		
	},
	
	expired:function(){
		
		// setup a tour
		var tour = new Shepherd.Tour({
		  defaults: {
		    classes: 'shephed-element',
		    scrollTo: true
		  }
		});
		
		tour.addStep('step1', {
		  text: i18n.t('tour_expired_step1'),
		  attachTo: {element: '#trial-notice', on: 'bottom'},
		  classes: 'no-arrow',
		  buttons: [
		    {
		      text: i18n.t('Exit'),
		      classes: 'shepherd-button-secondary',
		      action: function() {
		        return tour.hide();
		      }
		    },
		    {
		      text: i18n.t('Sign up'),
		      classes: 'shepherd-button-primary',
		      action: function() {
		       
		       	// set scope
			   	var scope = angular.element($("section.main")).scope();
			   	scope.signUp();
			   	
			   	return tour.hide();
		       
		      }
		    }
		  ]
		});
		
		tour.start();
		
	}
	
}