// sample plugin
.directive('pluginSample', function($rootScope){
	
	return{
		
		restrict: 'E',
		transclude: true,
		scope: {
			id: '@',
			class: '@',
			attr1: '@',
			attr2: '@'
		},
		templateUrl: 'templates/plugin/sample.html',
		link: function(scope, element, attr){}
		
	}
	
})