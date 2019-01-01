
var DemoApp = angular.module('DemoApp', [
	'ngResource',
	'ngRoute'
]);
DemoApp.factory('DataResource', function($resource) {
	return $resource('/:datatype/:id/:file', {}, {
		query: {method: 'GET', isArray: true},
		get: {method: 'GET'},
		remove: {method: 'DELETE'},
		edit: {method: 'PUT'},
		set: {method: 'POST'}
	});
});
DemoApp.controller('DemoCtrl', function($scope, $routeParams, $location, DataResource, $route, $rootScope, $interval) {

	if (!$rootScope.authenticated) {
		DataResource.get({datatype:"me"}, function(data) {
			$rootScope.userdata = data;
			$rootScope.authenticated = true;
			DataResource.query({datatype:"repos", id:$rootScope.userdata.login}, function(repos) {
				$rootScope.repositories=repos;
			});
		}, function(error) {
			$rootScope.user = "";
			$rootScope.authenticated = false;
		});
	}
	if ($routeParams.username!=null && $routeParams.repo!=null) {
		$rootScope.username = $routeParams.username;
		$rootScope.repo = $routeParams.repo;
		$rootScope.action = "log";
		if ($routeParams.action!=null) {
			$rootScope.action = $routeParams.action;
		}

		var currentData = function() {
			DataResource.get({datatype:"commits", id:$rootScope.username, file:$rootScope.repo}, function(data) {
        			$rootScope.item  = data;
        			$rootScope.current_shield_src = "/shield/" + $rootScope.username + "/" + $rootScope.repo + "?" + new Date().getTime();
        	});
		}
		currentData();
		if ($rootScope.action!="") {
    		switch ($rootScope.action) {
    			case "config":
    				DataResource.get({datatype:$rootScope.action, id:$rootScope.username, file:$rootScope.repo}, function(data) {
    					$scope.actiondata = data;
    				});
    				break;
    			default:
    				DataResource.query({datatype:$rootScope.action, id:$rootScope.username, file:$rootScope.repo}, function(data) {
    					$rootScope.actiondata = data;
    				});
    				break;
    		}
    	}
	}

});
DemoApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/:username/:repo/:action', {templateUrl: 'about.html', controller:'DemoCtrl'})
		.when('/:username/:repo', {templateUrl: 'about.html', controller: 'DemoCtrl'})
		.when('/help', {templateUrl: 'help.html', controller: 'DemoCtrl'})
		.when('/privacy', {templateUrl: 'privacy.html', controller: 'DemoCtrl'})
		.when('/', {templateUrl: 'home.html', controller: 'DemoCtrl'})
	;
}]);

DemoApp.filter('rawHtml', ['$sce', function($sce){
  return function(val) {
	json = JSON.stringify(val, undefined, 2);
	if (json===undefined)
		return;
	json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	something = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
	} else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
	return '<span class="' + cls + '">' + match + '</span>';
    });

    return $sce.trustAsHtml(something);
  };
}]);
