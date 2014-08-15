'use strict';


// Declare app level module which depends on filters, and services
angular.module('cgradminApp', [
    'ngRoute',
    'cgradminApp.filters',
    'cgradminApp.services',
    'cgradminApp.directives',
    'cgradminApp.controllers'
]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/timings', {templateUrl: 'partials/timings.html', controller: 'TimingsCtrl'});
        $routeProvider.when('/destinations', {templateUrl: 'partials/destinations.html', controller: 'DestinationsCtrl'});
        $routeProvider.when('/destination/:destId?', {templateUrl: 'partials/destination_detail.html', controller: 'DestinationDetailCtrl'});
        $routeProvider.when('/rates', {templateUrl: 'partials/rates.html', controller: 'RatesCtrl'});
        $routeProvider.when('/destinationrates', {templateUrl: 'partials/destinationrates.html', controller: 'DestinationRatesCtrl'});
        $routeProvider.when('/ratingplans', {templateUrl: 'partials/ratingplans.html', controller: 'RatingPlansCtrl'});
        $routeProvider.when('/ratingprofiles', {templateUrl: 'partials/ratingprofiles.html', controller: 'RatingProfilesCtrl'});
        $routeProvider.when('/rpaliases', {templateUrl: 'partials/rpaliases.html', controller: 'RatingProfileAliasesCtrl'});
        $routeProvider.when('/cataliases', {templateUrl: 'partials/cataliases.html', controller: 'CategoryAliasesCtrl'});
        $routeProvider.when('/actions', {templateUrl: 'partials/actions.html', controller: 'ActionsCtrl'});
        $routeProvider.when('/actionplans', {templateUrl: 'partials/actionplans.html', controller: 'ActionPlansCtrl'});
        $routeProvider.when('/actiontriggers', {templateUrl: 'partials/actiontriggers.html', controller: 'ActionTriggersCtrl'});
        $routeProvider.when('/sharedgroups', {templateUrl: 'partials/sharedgroups.html', controller: 'SharedGroupsCtrl'});
        $routeProvider.when('/accountactions', {templateUrl: 'partials/accountactions.html', controller: 'AccountActionsCtrl'});
        $routeProvider.when('/lcrrules', {templateUrl: 'partials/lcrrules.html', controller: 'LcrRulesCtrl'});
        $routeProvider.when('/derivedcharges', {templateUrl: 'partials/derivedcharges.html', controller: 'DerivedChargesCtrl'});
        $routeProvider.when('/cdrstats', {templateUrl: 'partials/cdrstats.html', controller: 'CdrStatsCtrl'});
        $routeProvider.otherwise({redirectTo: '/timings'});
    }]);
