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
       .controller('TimingsCtrl', function(resFactory) {
         this.partial = 'timings';
         this.res = {};
         this.detailsVisible = false;
         var ctrl = this;
         resFactory.getResourceIds('ApierV1.GetTPTimingIds').success(function(data) {ctrl.resources = data;});

         this.showDetails = function(resId){
           this.result = '';
           if (resId){
             resFactory.getResource('ApierV1.GetTPTiming', {TimingId: resId}).success(function(data) {ctrl.res = data;});
           } else {
             this.showId = true;
           }
           this.detailsVisible = true;
         }
         this.saveResource = function(){
           resFactory.setResource('ApierV1.SetTPTiming', this.res).success(function(data){ctrl.result = data;});
           if(this.resources.indexOf(this.res.TimingId) == -1){
             resFactory.getResourceIds('ApierV1.GetTPTimingIds').success(function(data) {ctrl.resources = data;});
           }
           this.res = {};
           this.detailsVisible = false;
         };
         this.deleteResource = function(resId){
           resFactory.delResource('ApierV1.RemTPTiming', {TimingId: resId}).success(function(data){ctrl.result = data;});
           var index = this.resources.indexOf(resId);
           if (index > -1){
             this.resources.splice(index, 1);
           }
         };
       })
       .controller('DestinationsCtrl', function(resFactory) {
         this.partial = 'destinations';
         this.res = {};
         this.detailsVisible = false;
         var ctrl = this;
         resFactory.getResourceIds('ApierV1.GetTPDestinationIds').success(function(data) {ctrl.resources = data;});

         this.showDetails = function(resId){
           this.result = '';
           if (resId){
             resFactory.getResource('ApierV1.GetTPDestination', {DestinationId: resId}).success(function(data) {ctrl.res = data;});
           } else {
             this.res = {};
             this.showId = true;
           }
           this.detailsVisible = true;
         }
         this.saveResource = function(){
           if(angular.isString(this.res.Prefixes)) {
             this.res.Prefixes = this.res.Prefixes.split(",");
           }
           resFactory.setResource('ApierV1.SetTPDestination', this.res).success(function(data){ctrl.result = data;});
           if(this.resources.indexOf(this.res.DestinationId) == -1){
             resFactory.getResourceIds('ApierV1.GetTPDestinationIds').success(function(data) {ctrl.resources = data;});
           }
           this.res = {};
           this.detailsVisible = false;
         };
         this.deleteResource = function(resId){
           resFactory.delResource('ApierV1.RemTPDestination', {DestinationId: resId}).success(function(data){ctrl.result = data;});
           var index = this.resources.indexOf(resId);
           if (index > -1){
             this.resources.splice(index, 1);
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
