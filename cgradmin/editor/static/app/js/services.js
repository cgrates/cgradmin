'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('cgradminApp.services', [])
       .value('version', '0.1')
       .value('idMethods', {
         "Timing": "GetTPTimingIds",
         "Destination": "GetTPDestinationIds",
         "Rate": "GetTPRateIds",
         "DestinationRate": "GetTPDestinationRateIds",
         "RatingPlan": "GetTPRatingPlanIds",
         "RatingProfile": "GetTPRatingProfileIds",
         "CdrStats": "GetTPCdrStatsIds",
         "Action": "GetTPActionIds",
         "ActionTrigger": "GetTPActionTriggerIds",
         "ActionPlan": "GetTPActionPlanIds",
         "AccountAction": "GetTPAccountActionIds",
         "SharedGroup": "GetTPSharedGroupIds",
         "DerivedCharger": "GetTPDerivedChargerIds",
       })
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
       .factory('resFactory', function($http, $cookieStore, $timeout) {
         var factory = {};
         factory.info = {message: ''};
         var param = {TPid : $cookieStore.get('tpid')};
         factory.call = function(func, finalParam){
           angular.extend(finalParam, param);
           return $http.post('/call/ApierV1.' + func, finalParam);
         };
         factory.setMessage = function(mes){
            factory.info.message = mes;
            $timeout(function(){factory.info.message='';}, 10000);
         }
         return factory;
       });
