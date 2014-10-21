'use strict';


// Declare app level module which depends on filters, and services
angular.module('cgradminApp', [
  'ngRoute',
  'ngCookies',
  'angular-loading-bar',
  'ngAnimate',
  'ui.bootstrap',  
  'cgradminApp.filters',
  'cgradminApp.services',
  'cgradminApp.directives',
  'cgradminApp.controllers'
])
       .config(['$routeProvider', function($routeProvider) {
         $routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard.html', controller: 'DashboardCtrl', controllerAs: 'dashCtrl'});
         $routeProvider.when('/resource/:res/:page?', {templateUrl: 'partials/resources.html', controller: 'ResourcesCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/timing/:res_id?', {templateUrl: 'partials/timing.html', controller: 'ResourceCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/destination/:res_id?', {templateUrl: 'partials/destination.html', controller: 'ResourceCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/rate/:res_id?', {templateUrl: 'partials/rate.html', controller: 'ResourceCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/destinationrate/:res_id?', {templateUrl: 'partials/destination_rate.html', controller: 'ResourceCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/ratingplan/:res_id?', {templateUrl: 'partials/rating_plan.html', controller: 'ResourceCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/ratingprofile/:res_id?', {templateUrl: 'partials/rating_profile.html', controller: 'ResourceCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/rpalias/:res_id?', {templateUrl: 'partials/rp_alias.html', controller: 'ResourceCtrl', controllerAs: 'resCrl'});
         $routeProvider.when('/action/:res_id?', {templateUrl: 'partials/action.html', controller: 'ResourceCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/actionplan/:res_id?', {templateUrl: 'partials/action_plan.html', controller: 'ResourceCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/actiontrigger/:res_id?', {templateUrl: 'partials/action_trigger.html', controller: 'ResourceCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/sharedgroup/:res_id?', {templateUrl: 'partials/shared_group.html', controller: 'ResourceCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/accountaction/:res_id?', {templateUrl: 'partials/account_action.html', controller: 'ResourceCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/lcrrule/:res_id?', {templateUrl: 'partials/lcr_rule.html', controller: 'ResourceCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/derivedcharger/:res_id?', {templateUrl: 'partials/derived_charger.html', controller: 'ResourceCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/cdrstats/:res_id?', {templateUrl: 'partials/cdr_stat.html', controller: 'ResourceCtrl', controllerAs: 'resCtrl'});
         $routeProvider.when('/import/:message?', {templateUrl: 'partials/import.html', controller: 'ImportCtrl', controllerAs: 'impCtrl'});
         $routeProvider.when('/exportcdrs/:message?', {templateUrl: 'partials/export_cdrs.html', controller: 'ExportCdrsCtrl', controllerAs: 'expCdrsCtrl'});
         $routeProvider.when('/exporttpcsv/:message?', {templateUrl: 'partials/export_tpcsv.html', controller: 'ExportTpCsvCtrl', controllerAs: 'expTpCsvCtrl'});
         $routeProvider.when('/activate/:res/:res_id?', {templateUrl: 'partials/activate.html', controller: 'ActivationCtrl', controllerAs: 'actCtrl'});
         $routeProvider.when('/tpid/new', {templateUrl: 'partials/tpid.html', controller: 'TpIdsCtrl', controllerAs: 'tpCtrl'});
         $routeProvider.when('/tpid/remove', {templateUrl: 'partials/activate.html', controller: 'TpIdsCtrl', controllerAs: 'tpCtrl'});
         $routeProvider.otherwise({redirectTo: '/dashboard'});
       }]);
