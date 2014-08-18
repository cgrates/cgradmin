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
       .controller('ResourcesCtrl', function($routeParams, resFactory){
         var ctrl = this;
         ctrl.partial = $routeParams.partial;
         ctrl.resources = [];
         resFactory.getResourceIds('ApierV1.GetTP' + ctrl.partial + 'Ids').success(function(data) {ctrl.resources = data;});
         this.deleteResource = function(resId){
           var param = {};
           param[ctrl.partial + 'Id'] = resId;
           resFactory.delResource('ApierV1.RemTP' + ctrl.partial, param).success(function(data){ctrl.result = data;});
           var index = this.resources.indexOf(resId);
           if (index > -1){
             this.resources.splice(index, 1);
           }
         };
       })
       .controller('TimingsCtrl', function($routeParams, resFactory) {
         this.res = {};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('ApierV1.GetTPTiming', {TimingId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('ApierV1.SetTPRatingProfile', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('DestinationsCtrl', function($routeParams, resFactory) {
         this.res = {};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('ApierV1.GetTPDestination', {DestinationId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           if(angular.isString(this.res.Prefixes)) {
             this.res.Prefixes = this.res.Prefixes.split(",");
           }
           resFactory.setResource('ApierV1.SetTPDestination', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('RatesCtrl', function($routeParams, resFactory) {
         this.res = {};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('ApierV1.GetTPRate', {RateId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('ApierV1.SetTPRate', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('DestinationRatesCtrl', function($routeParams, resFactory) {
         this.res = {};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('ApierV1.GetTPDestinationRate', {DestinationRateId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('ApierV1.SetTPDestinationRate', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('RatingPlansCtrl', function($routeParams, resFactory) {
         this.res = {};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('ApierV1.GetTPRatingPlan', {RatingPlanId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('ApierV1.SetTPRatingPlan', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('RatingProfilesCtrl', function($routeParams, resFactory) {
         this.res = {};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('ApierV1.GetTPRatingProfile', {RatingProfileId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('ApierV1.SetTPRatingProfile', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('RatingProfileAliasesCtrl', function($routeParams, resFactory) {
       })
       .controller('CategoryAliasesCtrl', function($routeParams, resFactory) {
       })
       .controller('LcrRulesCtrl', function($routeParams, resFactory) {
       })
       .controller('CdrStatsCtrl', function(metricsFactory) {
         var ctrl = this;
         metricsFactory.getMetrics({StatsQueueId: 'CDRST1'}).success(function(data) {ctrl.metrics = data;});
       })
       .controller('ActionsCtrl', function($routeParams, resFactory) {
       })
       .controller('ActionPlansCtrl', function($routeParams, resFactory) {
       })
       .controller('ActionTriggersCtrl', function($routeParams, resFactory) {
       })
       .controller('AccountActionsCtrl', function($routeParams, resFactory) {
       })
       .controller('SharedGroupsCtrl', function($routeParams, resFactory) {
       })
       .controller('DerivedChargesCtrl', function($routeParams, resFactory) {
       });
