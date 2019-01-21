
var CodetallyApp = angular.module('CodetallyApp', [
	'ngResource',
	'ngRoute'
]);
CodetallyApp.factory('DataResource', function($resource) {
	return $resource('/:datatype/:owner/:reponame'+'.json', {}, {
		query: {method: 'GET', isArray: true},
		get: {method: 'GET'},
		remove: {method: 'DELETE'},
		edit: {method: 'PUT'},
		set: {method: 'POST'}
	});
});
CodetallyApp.controller('MainCtrl', function($scope, $routeParams, $location, DataResource, $route, $rootScope, $interval) {

	if (!$rootScope.authenticated) {
		DataResource.get({datatype:"me"}, function(data) {
			$rootScope.userdata = data;
			$rootScope.authenticated = true;
		}, function(error) {
			$rootScope.user = "";
			$rootScope.authenticated = false;
		});
	}
	$rootScope.owner = $routeParams.owner;
	$rootScope.reponame = $routeParams.reponame;

        var tvaParts = $location.path().split("/");

	$rootScope.action = tvaParts[tvaParts.length-1]; 

	if ($rootScope.action!="") {
    		DataResource.query({datatype:$rootScope.action, owner:$rootScope.owner, reponame:$rootScope.reponame}, function(data) {
    			$rootScope.actiondata = data;
    		});
    	}

});
CodetallyApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/:owner/:reponame/webhooks/:webhookid/edit', {templateUrl: 'edit_webhook.html', controller:'MainCtrl'})
		.when('/:owner/:reponame/webhooks/:webhookid/deliveries', {templateUrl: 'list_webhookdeliveries.html', controller:'MainCtrl'})
		.when('/:owner/:reponame/webhooks/:webhookid', {templateUrl: 'edit_webhook.html', controller:'MainCtrl'})
		.when('/:owner/:reponame/webhooks', {templateUrl: 'list_webhooks.html', controller:'MainCtrl'})

		.when('/:owner/:reponame/history', {templateUrl: 'list_history.html', controller:'MainCtrl'})
		.when('/:owner/:reponame/log', {templateUrl: 'list_log.html', controller:'MainCtrl'})

		.when('/:owner/:reponame/charges/add', {templateUrl: 'add_charge.html', controller:'MainCtrl'})
		.when('/:owner/:reponame/charges/:chargeid', {templateUrl: 'edit_charge.html', controller:'MainCtrl'})
		.when('/:owner/:reponame/charges', {templateUrl: 'list_charges.html', controller:'MainCtrl'})

		.when('/:owner/repositories', {templateUrl: 'list_repositories.html', controller:'MainCtrl'})

		.when('/:owner/:reponame/integrations', {templateUrl: 'list_integrations.html', controller:'MainCtrl'})

		.when('/:owner/:reponame/notifications', {templateUrl: 'list_notifications.html', controller:'MainCtrl'})

		.when('/:owner/:reponame/:action', {templateUrl: 'about.html', controller:'MainCtrl'})
		.when('/:owner/:reponame', {templateUrl: 'view_repository.html', controller: 'MainCtrl'})

		.when('/help', {templateUrl: 'help.html', controller: 'MainCtrl'})
		.when('/privacy', {templateUrl: 'privacy.html', controller: 'MainCtrl'})
		.when('/', {templateUrl: 'home.html', controller: 'MainCtrl'})
	;
}]);
