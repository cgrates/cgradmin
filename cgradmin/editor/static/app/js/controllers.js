'use strict';

/* Controllers */

angular.module('cgradminApp.controllers', [])
       .controller('TpIdsCtrl', function($cookieStore, tpidsFactory) {
         this.tpid = $cookieStore.get('tpid');
         var ctrl = this;
         ctrl.tpids = [];
         tpidsFactory.getTpIds().success(function(data) {
           ctrl.tpids = data;
           if(!ctrl.tpid || ctrl.tpid==='"'){ // TODO: find from where does single quote comes from
             ctrl.tpid = data[0];
             $cookieStore.put('tpid', ctrl.tpid);
           }
         });
         this.getTpId = function(tpid){
           $cookieStore.put('tpid', tpid);
         };
       })
       .controller('TimingsCtrl', function(statusFactory) {
         var ctrl = this;
         statusFactory.getStatus().success(function(data) {ctrl.status = data;});
       })
       .controller('DestinationsCtrl', function(destinationsFactory) {
         this.dest = {};
         this.detailsVisible = false;
         var ctrl = this;
         destinationsFactory.getDestinationIds().success(function(data) {ctrl.destinations = data;});

         this.showDetails = function(destId){
           this.result = '';
           if (destId){
             destinationsFactory.getDestination({DestinationId: destId}).success(function(data) {ctrl.dest = data;});
           } else {
             this.showId = true;
           }
           this.detailsVisible = true;
         }
         this.saveDestination = function(){
           if(angular.isString(this.dest.Prefixes)) {
             this.dest.Prefixes = this.dest.Prefixes.split(",");
           }
           destinationsFactory.setDestination(this.dest).success(function(data){ctrl.result = data;});
           destinationsFactory.getDestinationIds().success(function(data) {ctrl.destinations = data;});
           this.dest = {};
           this.detailsVisible = false;
         };
         this.deleteDestination = function(destId){
           destinationsFactory.delDestination({DestinationId: destId}).success(function(data){ctrl.result = data;});
           var index = this.destinations.indexOf(destId);
           if (index > -1){
             this.destinations.splice(index, 1);
           }
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
         metricsFactory.getMetrics({StatsQueueId: 'CDRST1'}).success(function(data) {ctrl.metrics = data;});
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
