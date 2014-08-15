'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('cgradminApp.services', [])
    .value('version', '0.1')
    .factory('metricsFactory', function($http){
        var factory = {};
        factory.GetMetrics = function(param){
            return $http.post('/call/CDRStatsV1.GetMetrics', param);
        };
        return factory;
    })
    .factory('statusFactory', function($http){
        var factory = {};
        factory.GetStatus = function(){
            return $http.post('/call/Responder.Status');
        };
        return factory;
    })
    .factory('tpidsFactory', function($http){
        var factory = {};
        factory.GetTpIds = function(){
            return $http.post('/call/ApierV1.GetTPIds', {});
        };
        return factory;
    })
    .factory('destinationsFactory', function($http, $cookieStore) {
        var factory = {};
        factory.GetDestinationIds = function(){
            return $http.post('/call/ApierV1.GetTPDestinationIds', {TPid : $cookieStore.get('tpid')});
        };
        factory.GetDestination = function(destId){
            return $http.post('/call/ApierV1.GetTPDestination', {TPid : $cookieStore.get('tpid'), DestinationId: destId});
        };
        factory.SetDestination = function(dest){
            if(!dest.Tpid){
                dest.Tpid = $cookieStore.get('tpid');
            }
            return $http.post('/call/ApierV1.SetTPDestination', dest);
        };
        return factory;
    })
;
