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
         this.setTpId = function(tpid){
           this.tpid = tpid;
           $cookieStore.put('tpid', tpid);
         };
       })
       .controller('PanelCtrl', function(){
         this.init = function(){
           this.index = 0;
         }
         this.init();
         this.select = function(i){
           this.index = i;
         }
         this.add = function(resources){
           resources.push({});
           this.index = resources.length-1;
         }
         this.remove = function(resources, i, event){
           event.preventDefault();
           if (!confirm("Are you sure you want to delete this resource?")) {
             return;
           }
           resources.splice(i,1);
           if (this.index >= i) {
             this.index -= 1;
           }
         }
         this.isActive = function(i){
           return this.index === i;
         }
       })
       .controller('ResourcesCtrl', function($routeParams, resFactory, idMethods){
         var ctrl = this;
         ctrl.partial = $routeParams.partial;
         ctrl.resources = [];
         resFactory.getResourceIds(idMethods[ctrl.partial]).success(function(data) {ctrl.resources = data;});
         this.deleteResource = function(resId){
           if (!confirm("Are you sure you want to delete this resource?")) {
             return;
           }
           var param = {};
           param[ctrl.partial + 'Id'] = resId;
           resFactory.delResource('RemTP' + ctrl.partial, param).success(function(data){ctrl.result = data;});
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
           resFactory.getResource('GetTPTiming', {TimingId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPTiming', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('DestinationsCtrl', function($routeParams, resFactory) {
         this.res = {};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('GetTPDestination', {DestinationId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           if(angular.isString(this.res.Prefixes)) {
             this.res.Prefixes = this.res.Prefixes.split(",");
           }
           resFactory.setResource('SetTPDestination', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('RatesCtrl', function($routeParams, resFactory) {
         this.res = {RateSlots:[{}]};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('GetTPRate', {RateId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPRate', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('DestinationRatesCtrl', function($routeParams, resFactory) {
         this.res = {DestinationRates:[{}]};
         this.resId = $routeParams.res_id;
         this.destIds = ['*any'];
         this.rateIds = [];
         var ctrl = this;
         resFactory.getResourceIds('GetTPDestinationIds').success(function(data) {ctrl.destIds.push.apply(ctrl.destIds, data);});
         resFactory.getResourceIds('GetTPRateIds').success(function(data) {ctrl.rateIds = data;});

         this.result = '';
         if(this.resId){
           resFactory.getResource('GetTPDestinationRate', {DestinationRateId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPDestinationRate', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('RatingPlansCtrl', function($routeParams, resFactory) {
         this.res = {RatingPlanBindings: [{}]};
         this.resId = $routeParams.res_id;
         this.destRatesIds = [];
         this.tmIds = [];
         resFactory.getResourceIds('GetTPDestinationRateIds').success(function(data) {ctrl.destRatesIds = data;});
         resFactory.getResourceIds('GetTPTimingIds').success(function(data) {ctrl.tmIds = data;});
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('GetTPRatingPlan', {RatingPlanId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPRatingPlan', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('RatingProfilesCtrl', function($routeParams, resFactory) {
         this.res = {};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('GetTPRatingProfiles', {LoadId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPRatingProfile', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('RatingProfileAliasesCtrl', function($routeParams, resFactory) {
       })
       .controller('LcrRulesCtrl', function($routeParams, resFactory) {
       })
       .controller('CdrStatsCtrl', function($routeParams, resFactory) {
          this.res = {CdrStats:[{}]};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('GetTPCdrStats', {CdrStatsId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPCdrStats', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('ActionsCtrl', function($routeParams, resFactory) {
         this.res = {Actions:[{}]};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('GetTPActions', {ActionsId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPActions', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('ActionPlansCtrl', function($routeParams, resFactory) {
         this.res = {ActionPlan:[{}]};
         this.resId = $routeParams.res_id;
         this.actIds = [];
         this.tmIds = [];
         resFactory.getResourceIds('GetTPActionIds').success(function(data) {ctrl.actIds = data;});
         resFactory.getResourceIds('GetTPTimingIds').success(function(data) {ctrl.tmIds = data;});
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('GetTPActionPlan', {Id: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPActionPlan', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('ActionTriggersCtrl', function($routeParams, resFactory) {
         this.res = {ActionTriggers:[{}]};
         this.resId = $routeParams.res_id;
         this.actIds = [];
         resFactory.getResourceIds('GetTPActionIds').success(function(data) {ctrl.actIds = data;});
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('GetTPActionTriggers', {ActionTriggersId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPActionTriggers', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('AccountActionsCtrl', function($routeParams, resFactory) {
         this.res = {};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('GetTPAccountActions', {LoadId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPAccoutActions', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('SharedGroupsCtrl', function($routeParams, resFactory) {
         this.res = {SharedGroups:[{}]};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('GetTPSharedGroups', {SharedGroupsId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPSharedGroups', this.res).success(function(data){ctrl.result = data;});
         };
       })
       .controller('DerivedChargersCtrl', function($routeParams, resFactory) {
         this.res = {DerivedChargers:[{}]};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         this.result = '';
         if(this.resId){
           resFactory.getResource('GetTPDerivedChargers', {DerivedChargersId: this.resId}).success(function(data) {console.log(data);ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPDerivedChargers', this.res).success(function(data){ctrl.result = data;});
         };
       });
