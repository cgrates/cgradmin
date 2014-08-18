'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('cgradminApp.services', [])
       .value('version', '0.1')
       .factory('metricsFactory', function($http){
         var factory = {};
         factory.getMetrics = function(param){
           return $http.post('/call/CDRStatsV1.GetMetrics', param);
         };
         return factory;
       })
       .factory('statusFactory', function($http){
         var factory = {};
         factory.getStatus = function(){
           return $http.post('/call/Responder.Status');
         };
         return factory;
       })
       .factory('tpidsFactory', function($http){
         var factory = {};
         factory.getTpIds = function(){
           return $http.post('/call/ApierV1.GetTPIds', {});
         };
         return factory;
       })
       .factory('destinationsFactory', function($http, $cookieStore) {
         var factory = {};
         var param = {TPid : $cookieStore.get('tpid')};
         factory.getDestinationIds = function(){
           return $http.post('/call/ApierV1.GetTPDestinationIds', param);
         };
         factory.getDestination = function(destParam){
           angular.extend(destParam, param);
           return $http.post('/call/ApierV1.GetTPDestination', destParam);
         };
         factory.setDestination = function(destParam){
           angular.extend(destParam, param);
           return $http.post('/call/ApierV1.SetTPDestination', destParam);
         };
         factory.delDestination = function(destParam){
           angular.extend(destParam, param);
           return $http.post('/call/ApierV1.RemTPDestination', destParam);
         };
         return factory;
       })
;
