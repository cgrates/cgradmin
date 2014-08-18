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
        $routeProvider.when('/timings', {templateUrl: 'partials/timings.html', controller: 'TimingsCtrl', controllerAs: 'tmCtrl'});
        $routeProvider.when('/destinations', {templateUrl: 'partials/destinations.html', controller: 'DestinationsCtrl', controllerAs: 'destCtrl'});
        $routeProvider.when('/rates', {templateUrl: 'partials/rates.html', controller: 'RatesCtrl', controllerAs: 'rateCtrl'});
        $routeProvider.when('/destinationrates', {templateUrl: 'partials/destinationrates.html', controller: 'DestinationRatesCtrl', controllerAs: 'drCtrl'});
        $routeProvider.when('/ratingplans', {templateUrl: 'partials/ratingplans.html', controller: 'RatingPlansCtrl', controllerAs: 'rpCtrl'});
        $routeProvider.when('/ratingprofiles', {templateUrl: 'partials/ratingprofiles.html', controller: 'RatingProfilesCtrl', controllerAs: 'rpfCtrl'});
        $routeProvider.when('/rpaliases', {templateUrl: 'partials/rpaliases.html', controller: 'RatingProfileAliasesCtrl', controllerAs: 'rpaCrl'});
        $routeProvider.when('/cataliases', {templateUrl: 'partials/cataliases.html', controller: 'CategoryAliasesCtrl', controllerAs: 'caCtrl'});
        $routeProvider.when('/actions', {templateUrl: 'partials/actions.html', controller: 'ActionsCtrl', controllerAs: 'actCtrl'});
        $routeProvider.when('/actionplans', {templateUrl: 'partials/actionplans.html', controller: 'ActionPlansCtrl', controllerAs: 'aplCtrl'});
        $routeProvider.when('/actiontriggers', {templateUrl: 'partials/actiontriggers.html', controller: 'ActionTriggersCtrl', controllerAs: 'atrCtrl'});
        $routeProvider.when('/sharedgroups', {templateUrl: 'partials/sharedgroups.html', controller: 'SharedGroupsCtrl', controllerAs: 'sgCtrl'});
        $routeProvider.when('/accountactions', {templateUrl: 'partials/accountactions.html', controller: 'AccountActionsCtrl', controllerAs: 'aaCtrl'});
        $routeProvider.when('/lcrrules', {templateUrl: 'partials/lcrrules.html', controller: 'LcrRulesCtrl', controllerAs: 'lcrCtrl'});
        $routeProvider.when('/derivedcharges', {templateUrl: 'partials/derivedcharges.html', controller: 'DerivedChargesCtrl', controllerAs: 'dcCtrl'});
        $routeProvider.when('/cdrstats', {templateUrl: 'partials/cdrstats.html', controller: 'CdrStatsCtrl', controllerAs: 'statsCtrl'});
        $routeProvider.otherwise({redirectTo: '/timings'});
    }]);
