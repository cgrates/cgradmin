'use strict';


// Declare app level module which depends on filters, and services
angular.module('cgradminApp', [
  'ngRoute',
  'ngCookies',
  'ngAnimate',
  'ui.bootstrap',
  'cgradminApp.filters',
  'cgradminApp.services',
  'cgradminApp.directives',
  'cgradminApp.controllers'
])
       .config(['$routeProvider', function($routeProvider) {
         $routeProvider.when('/resource/:res/:page?', {templateUrl: 'partials/resources.html', controller: 'ResourcesCtrl', controllerAs: 'resCtrl', label: 'Home page'});
         $routeProvider.when('/timing/:res_id?', {templateUrl: 'partials/timing.html', controller: 'TimingsCtrl', controllerAs: 'resCtrl', label: "Timings"});
         $routeProvider.when('/destination/:res_id?', {templateUrl: 'partials/destination.html', controller: 'DestinationsCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/rate/:res_id?', {templateUrl: 'partials/rate.html', controller: 'RatesCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/destinationrate/:res_id?', {templateUrl: 'partials/destination_rate.html', controller: 'DestinationRatesCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/ratingplan/:res_id?', {templateUrl: 'partials/rating_plan.html', controller: 'RatingPlansCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/ratingprofile/:res_id?', {templateUrl: 'partials/rating_profile.html', controller: 'RatingProfilesCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/rpalias/:res_id?', {templateUrl: 'partials/rp_alias.html', controller: 'RatingProfileAliasesCtrl', controllerAs: 'resCrl'});
         $routeProvider.when('/action/:res_id?', {templateUrl: 'partials/action.html', controller: 'ActionsCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/actionplan/:res_id?', {templateUrl: 'partials/action_plan.html', controller: 'ActionPlansCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/actiontrigger/:res_id?', {templateUrl: 'partials/action_trigger.html', controller: 'ActionTriggersCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/sharedgroup/:res_id?', {templateUrl: 'partials/shared_group.html', controller: 'SharedGroupsCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/accountaction/:res_id?', {templateUrl: 'partials/account_action.html', controller: 'AccountActionsCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/lcrrule/:res_id?', {templateUrl: 'partials/lcr_rule.html', controller: 'LcrRulesCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/derivedcharger/:res_id?', {templateUrl: 'partials/derived_charger.html', controller: 'DerivedChargersCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/cdrstats/:res_id?', {templateUrl: 'partials/cdr_stat.html', controller: 'CdrStatsCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/import/:message?', {templateUrl: 'partials/import.html', controller: 'ImportCtrl', controllerAs: 'impCtrl'});
         $routeProvider.when('/export/:message?', {templateUrl: 'partials/export.html', controller: 'ExportCtrl', controllerAs: 'expCtrl'});
         $routeProvider.when('/activate/:res/:res_id?', {templateUrl: 'partials/activate.html', controller: 'ActivationCtrl', controllerAs: 'actCtrl'});
         $routeProvider.otherwise({redirectTo: '/resource/RatingProfile'});
       }]);
