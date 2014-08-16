'use strict';

/* Controllers */

angular.module('cgradminApp.controllers', [])
    .controller('TpIdsCtrl', function($cookieStore, tpidsFactory) {
        this.tpid = $cookieStore.get('tpid');
        var ctrl = this;
        ctrl.tpids = [];
        tpidsFactory.GetTpIds().success(function(data) {
            ctrl.tpids = data;
            if(!ctrl.tpid){
                ctrl.tpid = data[0];
                $cookieStore.put('tpid', ctrl.tpid);
            }
        });
        this.SetTpId = function(tpid){
             $cookieStore.put('tpid', tpid);
        };
    })
    .controller('TimingsCtrl', function(statusFactory) {
        var ctrl = this;
        statusFactory.GetStatus().success(function(data) {ctrl.status = data;});
    })
    .controller('DestinationsCtrl', function(destinationsFactory) {
        var ctrl = this;
        destinationsFactory.GetDestinationIds().success(function(data) {ctrl.destinations = data;});
    })
    .controller('DestinationDetailCtrl', function($routeParams, destinationsFactory) {
        var ctrl = this;
        if($routeParams.destId){
            destinationsFactory.GetDestination($routeParams.destId).success(function(data) {ctrl.dest = data;});
        } else {
            this.showId = true;
        }
        this.saveDestination=function(){
            if(angular.isString(this.dest.Prefixes)) {
                this.dest.Prefixes = this.dest.Prefixes.split(",");
            }
            destinationsFactory.SetDestination(this.dest).success(function(data){ctrl.result = data;});
        };
    })
    .controller('RatesCtrl', function() {
    })
    .controller('DestinationRatesCtrl', function() {
    })
    .controller('RatingPlansCtrl', function() {
    })
    .controller('RatingProfilesCtrl', function() {
    })
    .controller('RatingProfileAliasesCtrl', function() {
    })
    .controller('CategoryAliasesCtrl', function() {
    })
    .controller('LcrRulesCtrl', function() {
    })
    .controller('CdrStatsCtrl', function(metricsFactory) {
        var ctrl = this;
        metricsFactory.GetMetrics({StatsQueueId: 'CDRST1'}).success(function(data) {ctrl.metrics = data;});
    })
    .controller('ActionsCtrl', function() {
    })
    .controller('ActionPlansCtrl', function() {
    })
    .controller('ActionTriggersCtrl', function() {
    })
    .controller('AccountActionsCtrl', function() {
    })
    .controller('SharedGroupsCtrl', function() {
    })
    .controller('DerivedChargesCtrl', function() {
    });
