'use strict';

/* Controllers */

angular.module('cgradminApp.controllers', [])
       .controller('TpIdsCtrl', function($cookieStore, $window, tpidsFactory) {
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
           $window.location.reload();
         };
       })
       .controller('NotificationCtrl', function(resFactory){
         this.notification = resFactory.info;
         this.getClass = function(){
           if (this.notification.message.indexOf('OK') > -1){
             return 'alert-success';
           }
           if (this.notification.message.indexOf('ERROR') > -1){
             return 'alert-danger';
           }
           return 'alert-info';
         }
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
           n}
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
       .controller('ResourcesCtrl', function($routeParams, resFactory, idMethods, breadcrumbs){
         var ctrl = this;
         breadcrumbs.options = { 'Stock Detail': $routeParams.res + ' Details' };
         ctrl.breadcrumbs = breadcrumbs;
         console.log(breadcrumbs.get());
         ctrl.res = $routeParams.res;
         ctrl.resources = [];
         ctrl.page = 0;
         ctrl.searchTerm = "";
         if ($routeParams.page){
           var p = Number($routeParams.page);
           if (p > 0){
             p -= 1;
           } else {
             p = 1;
           }
           ctrl.page =  p;
         }
         ctrl.itemsPerPage = 30;
         resFactory.getResourceIds(idMethods[ctrl.res], {Page:ctrl.page, ItemsPerPage:ctrl.itemsPerPage, SearchTerm:ctrl.searchTerm}).success(function(data) {
           ctrl.resources = data;
         });
         this.deleteResource = function(resId){
           if (!confirm("Are you sure you want to delete this resource?")) {
             return;
           }
           var param = {};
           param[ctrl.res + 'sId'] = resId;
           resFactory.delResource('RemTP' + ctrl.res + 's', param).success(function(data){resFactory.setMessage(data);});
           var index = this.resources.indexOf(resId);
           if (index > -1){
             this.resources.splice(index, 1);
           }
         };
         this.getPage = function(page){
           ctrl.page = page;
           resFactory.getResourceIds(idMethods[ctrl.res], {Page:ctrl.page, ItemsPerPage:ctrl.itemsPerPage, SearchTerm:ctrl.searchTerm}).success(function(data) {
             ctrl.resources = data;
           });
         }
       })
       .controller('TimingsCtrl', function($routeParams, resFactory) {
         this.res = {};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         if(this.resId){
           resFactory.getResource('GetTPTiming', {TimingId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPTiming', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('DestinationsCtrl', function($routeParams, resFactory) {
         this.res = {};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         if(this.resId){
           resFactory.getResource('GetTPDestination', {DestinationId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           if(angular.isString(this.res.Prefixes)) {
             this.res.Prefixes = this.res.Prefixes.split(",");
           }
           resFactory.setResource('SetTPDestination', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('RatesCtrl', function($routeParams, resFactory) {
         this.res = {RateSlots:[{}]};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         if(this.resId){
           resFactory.getResource('GetTPRate', {RateId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPRate', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('DestinationRatesCtrl', function($routeParams, resFactory) {
         this.res = {DestinationRates:[{}]};
         this.resId = $routeParams.res_id;
         this.destIds = ['*any'];
         this.rateIds = [];
         this.destSearchTerm = '';
         this.rateSearchTerm = '';
         var ctrl = this;
         resFactory.getResourceIds('GetTPDestinationIds', {ItemsPerPage:10, SearchTerm:ctrl.destSearchTerm}).success(function(data) {ctrl.destIds.push.apply(ctrl.destIds, data);});
         resFactory.getResourceIds('GetTPRateIds', {ItemsPerPage:10, SearchTerm:ctrl.rateSearchTerm}).success(function(data) {ctrl.rateIds = data;});

         if(this.resId){
           resFactory.getResource('GetTPDestinationRate', {DestinationRateId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPDestinationRate', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('RatingPlansCtrl', function($routeParams, resFactory) {
         this.res = {RatingPlanBindings: [{}]};
         this.resId = $routeParams.res_id;
         this.destRatesIds = [];
         this.tmIds = [];
         this.destRateSearchTerm = '';
         this.timingSearchTerm = '';
         var ctrl = this;
         resFactory.getResourceIds('GetTPDestinationRateIds', {ItemsPerPage:10, SearchTerm:ctrl.destRateSearchTerm}).success(function(data) {ctrl.destRatesIds = data;});
         resFactory.getResourceIds('GetTPTimingIds', {ItemsPerPage:10, SearchTerm:ctrl.timingSearchTerm}).success(function(data) {ctrl.tmIds = data;});

         if(this.resId){
           resFactory.getResource('GetTPRatingPlan', {RatingPlanId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPRatingPlan', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('RatingProfilesCtrl', function($routeParams, resFactory) {
         this.res = {RatingPlanActivations:[{}]};
         this.resId = $routeParams.res_id;
         this.rpSearchTerm = '';
         var ctrl = this;
         resFactory.getResourceIds('GetTPRatingPlanIds', {ItemsPerPage:10, SearchTerm:ctrl.rpSearchTerm}).success(function(data) {ctrl.rPlans = data;});

         if(this.resId){
           resFactory.getResource('GetTPRatingProfiles', {RatingProfilesId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPRatingProfile', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
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

         if(this.resId){
           resFactory.getResource('GetTPCdrStats', {CdrStatsId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPCdrStats', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('ActionsCtrl', function($routeParams, resFactory) {
         this.res = {Actions:[{}]};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         if(this.resId){
           resFactory.getResource('GetTPActions', {ActionsId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPActions', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('ActionPlansCtrl', function($routeParams, resFactory) {
         this.res = {ActionPlan:[{}]};
         this.resId = $routeParams.res_id;
         this.actIds = [];
         this.tmIds = [];
         this.actSearchTerm = '';
         this.timingSearchTerm = '';
         var ctrl = this;
         resFactory.getResourceIds('GetTPActionIds', {ItemsPerPage:10, SearchTerm:ctrl.actSearchTerm}).success(function(data) {ctrl.actIds = data;});
         resFactory.getResourceIds('GetTPTimingIds', {ItemsPerPage:10, SearchTerm:ctrl.timingSearchTerm}).success(function(data) {ctrl.tmIds = data;});

         if(this.resId){
           resFactory.getResource('GetTPActionPlan', {Id: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPActionPlan', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('ActionTriggersCtrl', function($routeParams, resFactory) {
         this.res = {ActionTriggers:[{}]};
         this.resId = $routeParams.res_id;
         this.actIds = [];
         this.actSearchTerm = '';
         var ctrl = this;
         resFactory.getResourceIds('GetTPActionIds', {ItemsPerPage:10, SearchTerm:ctrl.actSearchTerm}).success(function(data) {ctrl.actIds = data;});

         if(this.resId){
           resFactory.getResource('GetTPActionTriggers', {ActionTriggersId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPActionTriggers', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('AccountActionsCtrl', function($routeParams, resFactory) {
         this.res = {};
         this.resId = $routeParams.res_id;
         this.actSearchTerm = '';
         this.actTrigSearchTerm = '';
         var ctrl = this;
         resFactory.getResourceIds('GetTPActionPlanIds', {ItemsPerPage:10, SearchTerm:ctrl.actSearchTerm}).success(function(data) {ctrl.actPlans = data;});
         resFactory.getResourceIds('GetTPActionTriggerIds', {ItemsPerPage:10, SearchTerm:ctrl.actTrigSearchTerm}).success(function(data) {ctrl.actTriggers = data;});

         if(this.resId){
           resFactory.getResource('GetTPAccountActions', {AccountActionsId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPAccountActions', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('SharedGroupsCtrl', function($routeParams, resFactory) {
         this.res = {SharedGroups:[{}]};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         if(this.resId){
           resFactory.getResource('GetTPSharedGroups', {SharedGroupsId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPSharedGroups', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('DerivedChargersCtrl', function($routeParams, resFactory) {
         this.res = {DerivedChargers:[{}]};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         if(this.resId){
           resFactory.getResource('GetTPDerivedChargers', {DerivedChargersId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.setResource('SetTPDerivedChargers', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('ImportCtrl', function($routeParams, $location, resFactory){
         if ($routeParams.message) {
           $location.path('/import');
           resFactory.setMessage($routeParams.message);
         }
       });
