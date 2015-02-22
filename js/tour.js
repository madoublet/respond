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

	editor:function(){	
		// setup a tour
		var tour = new Shepherd.Tour({
		  defaults: {
		    classes: 'shepherd-element',
		    scrollTo: true
		  }
		});

		tour.addStep('step1', {
		  text: i18n.t('tour_editor_step1'),
		  attachTo: {element: '.editor-menu', on: 'bottom'},
		  classes: 'no-arrow pull-front',
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
				$('.block').addClass('shepherd-highlight');
		        return tour.next();
		      }
		    }
		  ]
		});

		tour.addStep('step2', {
		  text: i18n.t('tour_editor_step2'),
		  attachTo: {element: '#block-1', on: 'bottom'},
		  classes: 'pull-front no-arrow',
		  buttons: [
		    {
		      text: i18n.t('Exit'),
		      classes: 'shepherd-button-secondary',
		      action: function() {
				$('.block').removeClass('shepherd-highlight');
		        return tour.hide();
		      }
		    },
		    {
		      text: i18n.t('Next'),
		      classes: 'shepherd-button-primary',
		      action: function() {
				$('.block').removeClass('shepherd-highlight');
				/* Ideally we would scroll the editor menu all the way to the right at this 
				   point, but I can't figure out how to do it */
				$('a.fa-columns').addClass('shepherd-editoraction-hover');
		        return tour.next();
		      }
		    }
		  ]
		});

		tour.addStep('step3', {
		  text: i18n.t('tour_editor_step3'),
		  attachTo: 'a.fa-columns bottom',
		  classes: 'pull-front',
		  buttons: [
		    {
		      text: i18n.t('Exit'),
		      classes: 'shepherd-button-secondary',
		      action: function() {
				$('a.fa-columns').removeClass('shepherd-editoraction-hover');
		        return tour.hide();
		      }
		    },
		    {
		      text: i18n.t('Next'),
		      classes: 'shepherd-button-primary',
		      action: function() {
				$('a.fa-columns').removeClass('shepherd-editoraction-hover');
				$('.block:first > .block-actions > .expand-menu').addClass('active');
				$('.block:first > .block-actions > .element-menu').addClass('active');
		        return tour.next();
		      }
		    }
		  ],
		  tetherOptions:{
			  offset: '-20px -7px',
		  }
		});

		tour.addStep('step4', {
		  text: i18n.t('tour_editor_step4'),
		  attachTo: '.element-menu bottom',
		  classes: 'pull-front',
		  buttons: [
		    {
		      text: i18n.t('Exit'),
		      classes: 'shepherd-button-secondary',
		      action: function() {
				$('.block:first > .block-actions > .expand-menu').removeClass('active');
				$('.block:first > .block-actions > .element-menu').removeClass('active');
		        return tour.hide();
		      }
		    },
		    {
		      text: i18n.t('Next'),
		      classes: 'shepherd-button-primary',
		      action: function() {
				$('.block:first > .block-actions > .expand-menu').removeClass('active');
				$('.block:first > .block-actions > .element-menu').removeClass('active');
				$('a.respond-image').addClass('shepherd-editoraction-hover');
		        return tour.next();
		      }
		    }
		  ],
		  tetherOptions:{
			  offset: '-36px 10px',
		  }
		});

		tour.addStep('step5', {
		  text: i18n.t('tour_editor_step5'),
		  attachTo: 'a.respond-image bottom',
		  classes: 'pull-front',
		  buttons: [
		    {
		      text: i18n.t('Exit'),
		      classes: 'shepherd-button-secondary',
		      action: function() {
				$('a.respond-image').removeClass('shepherd-editoraction-hover');
		        return tour.hide();
		      }
		    },
		    {
		      text: i18n.t('Next'),
		      classes: 'shepherd-button-primary',
		      action: function() {
				$('a.respond-image').removeClass('shepherd-editoraction-hover');
				$('.editor .move').first().show();
				$('.editor .move').first().addClass('shepherd-move-hover');
		        return tour.next();
		      }
		    }
		  ],
		  tetherOptions:{
			  offset: '-20px -7px',
		  }
		});

		tour.addStep('step6', {
		  text: i18n.t('tour_editor_step6'),
		  attachTo: '.editor .move left',
		  classes: 'pull-front',
		  buttons: [
		    {
		      text: i18n.t('Exit'),
		      classes: 'shepherd-button-secondary',
		      action: function() {
				$('.editor .move').first().removeClass('shepherd-move-hover');
				$('.editor .move').first().hide();
		        return tour.hide();
		      }
		    },
		    {
		      text: i18n.t('Next'),
		      classes: 'shepherd-button-primary',
		      action: function() {
				$('.editor .move').first().removeClass('shepherd-move-hover');
				$('.editor .move').first().hide();
		        return tour.next();
		      }
		    }
		  ],
		  tetherOptions:{
			  offset: '-60px -5px',
		  }
		});

		tour.addStep('step7', {
		  text: i18n.t('tour_editor_step7'),
		  attachTo: {element: '#block-1', on: 'bottom'},
		  classes: 'pull-front no-arrow',
		  buttons: [
		    {
		      text: i18n.t('Let\'s Do This!'),
		      classes: 'shepherd-button-primary',
		      action: function() {
		        return tour.hide();
		      }
		    }
		  ]
		});
		
		tour.start();

	}
}