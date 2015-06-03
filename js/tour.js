var tour = {
	
	intro:function(){
		
		// setup a tour
		var tour = new Shepherd.Tour({
		  defaults: {
		    classes: 'shepherd-element',
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
		    classes: 'shepherd-element',
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
		
	},
	
	// Page editor tour
	editor:function(){	
		// setup a tour
		var tour = new Shepherd.Tour({
		  defaults: {
		    classes: 'shepherd-element',
		    scrollTo: false
		  }
		});

		// Step 1: In this tour we'll show you the basics of the Respond editor
		tour.addStep('step1', {
		  text: i18n.t('tour_editor_step1'),
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

		      	// add highlighting classes to layout blocks
				$('.block').addClass('shepherd-highlight');

				// Simulate clicking the Next button in the editor toolbar, to make the Add Layout button visible for step 3.
				// Ideally we would do this at the end of step 2, but Tether won't attach properly until the animation is 
				// complete, and Flipsnap doesn't offer a callback that allows us to wait until that has happened.  So 
				// we trigger it now, so the animation can run while the user is reading step 2
				var fs = Flipsnap('.editor-actions div', {distance: 400, maxPoint:3});
				fs.toNext();

		        return tour.next();
		      }
		    }
		  ]
		});

		// Step 2: You assemble pages by stacking layout blocks
		tour.addStep('step2', {
		  text: i18n.t('tour_editor_step2'),
		  attachTo: {element: 'div.block', on: 'top'},
		  classes: 'pull-front no-arrow',
		  buttons: [
		    {
		      text: i18n.t('Exit'),
		      classes: 'shepherd-button-secondary',
		      action: function() {

		      	// remove the highlighing from the layout blocks
				$('.block').removeClass('shepherd-highlight');

				// return the editor toolbar to the leftmost position
				var fs = Flipsnap('.editor-actions div', {distance: 400, maxPoint:3});
				fs.toPrev();
		        return tour.hide();
		      }
		    },
		    {
		      text: i18n.t('Next'),
		      classes: 'shepherd-button-primary',
		      action: function() {

		      	// remove the highlighing from the layout blocks
				$('.block').removeClass('shepherd-highlight');

				// Add a simulated hover class to the Add Layout button in the toolbar
				$('a.fa-columns').addClass('shepherd-editoraction-hover');

				// Here's something we need in step 4 that we have to prepare at the end of step 2
				// Again, these menus are animated, and Tether won't attach to them properly until they're finished animating.
				// Because they're CSS menus, there's no easy way that I know of to wait until they're done animating.
				// So we allow the animation to run while the user is reading step 3
				$('.block:first > .block-actions > .expand-menu').addClass('active');
				$('.block:first > .block-actions > .element-menu').addClass('active');

				// Notice that we leave the editor toolbar in the rightmost position.  
				// We need it in that state for the next step

		        return tour.next();
		      }
		    }
		  ]
		});

		// Step 3: How to add a new layout block
		tour.addStep('step3', {
		  text: i18n.t('tour_editor_step3'),
		  attachTo: { element: 'a.fa-columns', on: 'bottom'},
		  classes: 'pull-front',
		  buttons: [
		    {
		      text: i18n.t('Exit'),
		      classes: 'shepherd-button-secondary',
		      action: function() {

		      	// Remove the simulated hover class from the Add Layout button in the editor toolbar
				$('a.fa-columns').removeClass('shepherd-editoraction-hover');

				// return the editor toolbar to the leftmost position
				var fs = Flipsnap('.editor-actions div', {distance: 400, maxPoint:3});
				fs.toPrev();

				// close the layout block actions menu
				$('.block:first > .block-actions > .expand-menu').addClass('active');
				$('.block:first > .block-actions > .element-menu').addClass('active');

		        return tour.hide();
		      }
		    },
		    {
		      text: i18n.t('Next'),
		      classes: 'shepherd-button-primary',
		      action: function() {

		      	// Remove the simulated hover class from the Add Layout button in the editor toolbar
				$('a.fa-columns').removeClass('shepherd-editoraction-hover');

				// return the editor toolbar to the leftmost position
				var fs = Flipsnap('.editor-actions div', {distance: 400, maxPoint:3});
				fs.toPrev();

		        return tour.next();
		      }
		    }
		  ],
		  tetherOptions:{
		  	attachment: 'top center',
		  	targetAttachment: 'bottom center',
		  	targetOffset: '0 7px'

		  }
		});

		// Step 4: How to move layout blocks up and down
		tour.addStep('step4', {
		  text: i18n.t('tour_editor_step4'),
		  attachTo: '.element-menu bottom',
		  classes: 'pull-front',
		  buttons: [
		    {
		      text: i18n.t('Exit'),
		      classes: 'shepherd-button-secondary',
		      action: function() {

				// close the layout block actions menu
				$('.block:first > .block-actions > .expand-menu').addClass('active');
				$('.block:first > .block-actions > .element-menu').addClass('active');
		        return tour.hide();
		      }
		    },
		    {
		      text: i18n.t('Next'),
		      classes: 'shepherd-button-primary',
		      action: function() {

				// close the layout block actions menu
				$('.block:first > .block-actions > .expand-menu').removeClass('active');
				$('.block:first > .block-actions > .element-menu').removeClass('active');

				// Add a simulated hover class to the Add Image button in the toolbar
				$('a.respond-image').addClass('shepherd-editoraction-hover');
		        return tour.next();
		      }
		    }
		  ],
		  tetherOptions:{
		  	attachment: 'top right',
		  	targetAttachment: 'bottom center'
		  }
		});

		// Step 4: How to drag an element into a layout block
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
		  attachTo: '.editor .move bottom',
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
		  	attachment: 'top center',
		  	targetAttachment: 'bottom center'
		  }
		});

		tour.addStep('step7', {
		  text: i18n.t('tour_editor_step7'),
		  classes: 'pull-front no-arrow',
		  buttons: [
		    {
		      text: i18n.t("Let's Do This!"),
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