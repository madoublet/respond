(function() {
	
	angular.module('respond.controllers')
    
    // login controller
	.controller('LoginCtrl', function($scope, $window, $state, $stateParams, $rootScope, $i18next, Setup, User, Site, Editor) {
		
		$rootScope.template = 'login';
	
		// setup
		$scope.setup = Setup;
		
		// get friendlyId
		$scope.friendlyId = $stateParams.id;
		$window.sessionStorage.loginId = $stateParams.id;
		
		// set system message
		$scope.showSystemMessage = false;
		
		if(Setup.systemMessage != ''){
			$scope.showSystemMessage = true;
		}
		
		// login
		$scope.login = function(user){
		
			message.showMessage('progress');
			
			// login user
			User.login(user.email, user.password, $scope.friendlyId,
				function(data){		// success
				
					// make sure the user has admin permissions
					if(data.user.CanEdit != '' || data.user.CanPublish != ''  || data.user.CanRemove != ''  || data.user.CanCreate != ''){
					
						// save token
						$window.sessionStorage.token = data.token;
						
						// set language to the users language
						$i18next.options.lng =  data.user.Language;
						moment.lang(data.user.Language);
						
						// set user in $rootScope, session
						$rootScope.user = data.user;
						$window.sessionStorage.user = JSON.stringify(data.user);
						
						var start = data.start;
						
						// set firstLogin
						$rootScope.firstLogin = data.firstLogin;
						$rootScope.introTourShown = false;
						$rootScope.expiredTourShown = false;
						$rootScope.editorTourShown = false;
						
						// retrieve site
						Site.retrieve(function(data){
						
							message.showMessage('success');
						
							// set site in $rootScope, session
							$rootScope.site = data;
							$window.sessionStorage.site = JSON.stringify(data);
							
							// set start
							$state.go(start);
								
						});
						
						// pre-cache editor 
						Editor.list(function(data){
		
							// debugging
							if(Setup.debug)console.log('[respond.debug] Editor.list');
							if(Setup.debug)console.log(data);
							
							for (index = 0; index < data.length; ++index) {
								data[index].title = i18n.t(data[index].title);
							}
							$rootScope.editorItems = data;
							$window.sessionStorage.editorItems = JSON.stringify(data);
							
							// set cache to true so it won't reload scripts
							$.ajaxSetup({
							    cache: true
							});
							
							// holds loaded scripts
							var loaded = [];
							
							// load scripts for all plugins
							for(x=0; x<data.length; x++){
			
								if(data[x].script != undefined){
									var url = Setup.url + '/' + data[x].script;
									
									if(loaded.indexOf(url) == -1){
										$.getScript(url);
										loaded.push(url);
										if(Setup.debug)console.log('[respond.debug] load plugin script='+url);
									}
								}
								
							}
							
						});
						
						
					}
					else{
						if(Setup.debug)console.log('[respond.error] user does not have admin privileges');
						message.showMessage('error');
					}
					
				},
				function(){		// failure
					message.showMessage('error');
				});
			
		};
	})
	
})();