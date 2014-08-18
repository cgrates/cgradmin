'use strict';


// Declare app level module which depends on filters, and services
angular.module('cgradminApp', [
    'ngRoute',
    'ngCookies',
    'cgradminApp.filters',
    'cgradminApp.services',
    'cgradminApp.directives',
    'cgradminApp.controllers'
]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/timings', {templateUrl: 'partials/resources.html', controller: 'TimingsCtrl', controllerAs: 'resCtrl'});
        $routeProvider.when('/destinations', {templateUrl: 'partials/resources.html', controller: 'DestinationsCtrl', controllerAs: 'resCtrl'});
        $routeProvider.when('/rates', {templateUrl: 'partials/resources.html', controller: 'RatesCtrl', controllerAs: 'resCtrl'});
        $routeProvider.when('/destinationrates', {templateUrl: 'partials/resources.html', controller: 'DestinationRatesCtrl', controllerAs: 'resCtrl'});
        $routeProvider.when('/ratingplans', {templateUrl: 'partials/resources.html', controller: 'RatingPlansCtrl', controllerAs: 'resCtrl'});
        $routeProvider.when('/ratingprofiles', {templateUrl: 'partials/resources.html', controller: 'RatingProfilesCtrl', controllerAs: 'resCtrl'});
        $routeProvider.when('/rpaliases', {templateUrl: 'partials/resources.html', controller: 'RatingProfileAliasesCtrl', controllerAs: 'resCrl'});
        $routeProvider.when('/cataliases', {templateUrl: 'partials/resources.html', controller: 'CategoryAliasesCtrl', controllerAs: 'resCtrl'});
        $routeProvider.when('/actions', {templateUrl: 'partials/resources.html', controller: 'ActionsCtrl', controllerAs: 'resCtrl'});
        $routeProvider.when('/actionplans', {templateUrl: 'partials/resources.html', controller: 'ActionPlansCtrl', controllerAs: 'resCtrl'});
        $routeProvider.when('/actiontriggers', {templateUrl: 'partials/resources.html', controller: 'ActionTriggersCtrl', controllerAs: 'resCtrl'});
        $routeProvider.when('/sharedgroups', {templateUrl: 'partials/resources.html', controller: 'SharedGroupsCtrl', controllerAs: 'resCtrl'});
        $routeProvider.when('/accountactions', {templateUrl: 'partials/resources.html', controller: 'AccountActionsCtrl', controllerAs: 'resCtrl'});
        $routeProvider.when('/lcrrules', {templateUrl: 'partials/resources.html', controller: 'LcrRulesCtrl', controllerAs: 'resCtrl'});
        $routeProvider.when('/derivedcharges', {templateUrl: 'partials/resources.html', controller: 'DerivedChargesCtrl', controllerAs: 'resCtrl'});
        $routeProvider.when('/cdrstats', {templateUrl: 'partials/resources.html', controller: 'CdrStatsCtrl', controllerAs: 'resCtrl'});
        $routeProvider.otherwise({redirectTo: '/timings'});
    }]);
