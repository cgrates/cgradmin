'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('MyCtrl1', ['$scope', function($scope) {
    }])
    .controller('MyCtrl2', ['$scope', '$http', function($scope, $http) {
        var url = '/call/CDRStatsV1.GetMetrics';
        var param = {StatsQueueId: 'CDRST1'};
        $http.post(url, param).success(function(data, status, headers, config) {
            $scope.status = data;
        });
    }]);
