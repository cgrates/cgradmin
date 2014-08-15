'use strict';

/* Controllers */

angular.module('cgradminApp.controllers', [])
    .controller('TimingsCtrl', ['$scope', function($scope) {
    }])
    .controller('DestinationsCtrl', ['$scope', '$http', function($scope, $http) {
        var url = '/call/CDRStatsV1.GetMetrics';
        var param = {StatsQueueId: 'CDRST1'};
        $http.post(url, param).success(function(data, status, headers, config) {
            $scope.status = data;
        });
    }])
    .controller('RatesCtrl', ['$scope', function($scope) {
    }])
    .controller('DestinationRatesCtrl', ['$scope', function($scope) {
    }])
    .controller('RatingPlansCtrl', ['$scope', function($scope) {
    }])
    .controller('RatingProfilesCtrl', ['$scope', function($scope) {
    }])
    .controller('RatingProfileAliasesCtrl', ['$scope', function($scope) {
    }])
    .controller('CategoryAliasesCtrl', ['$scope', function($scope) {
    }])
    .controller('LcrRulesCtrl', ['$scope', function($scope) {
    }])
    .controller('CdrStatsCtrl', ['$scope', function($scope) {
    }])
    .controller('ActionsCtrl', ['$scope', function($scope) {
    }])
    .controller('ActionPlansCtrl', ['$scope', function($scope) {
    }])
    .controller('ActionTriggersCtrl', ['$scope', function($scope) {
    }])
    .controller('AccountActionsCtrl', ['$scope', function($scope) {
    }])
    .controller('SharedGroupsCtrl', ['$scope', function($scope) {
    }])
    .controller('DerivedChargesCtrl', ['$scope', function($scope) {
    }]);
