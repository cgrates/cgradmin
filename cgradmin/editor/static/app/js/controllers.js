'use strict';

/* Controllers */

angular.module('cgradminApp.controllers', [])
       .controller('TpIdsCtrl', function($cookieStore, $window, tpidsFactory) {
         this.tpid = $cookieStore.get('tpid');
         var ctrl = this;
         ctrl.tpids = [];
         tpidsFactory.getTpIds().success(function(data) {
           ctrl.tpids = data;
           if((!ctrl.tpid || ctrl.tpid==='"') && angular.isArray(data)){ // TODO: find from where does single quote comes from
             ctrl.tpid = data[0];
             $cookieStore.put('tpid', ctrl.tpid);
             $window.location.reload();
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
         //console.log(breadcrumbs.get());
         ctrl.res = $routeParams.res;
         ctrl.resources = [];
         ctrl.selectedResources = [];
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
         resFactory.call(idMethods[ctrl.res], {Page:ctrl.page, ItemsPerPage:ctrl.itemsPerPage, SearchTerm:ctrl.searchTerm}).success(function(data) {
           if (angular.isArray(data)){
             ctrl.resources = data;
           }
         });
         this.deleteResource = function(resId){
           var param = {};
           param[ctrl.res + 'Id'] = resId;
           resFactory.call('RemTP' + ctrl.res, param).success(function(data){resFactory.setMessage(data);});
           var index = this.resources.indexOf(resId);
           if (index > -1){
             this.resources.splice(index, 1);
           }
         };
         this.getPage = function(page){
           if(typeof(page)==='undefined') page = 0;
           ctrl.page += page;
           resFactory.call(idMethods[ctrl.res], {Page:ctrl.page, ItemsPerPage:ctrl.itemsPerPage, SearchTerm:ctrl.searchTerm}).success(function(data) {
             if (angular.isArray(data)){
               ctrl.resources = data;
             } else {
               ctrl.resources = [];
             }
           });
         };
         this.toggleSelectedState = function(resId){
           var index = this.selectedResources.indexOf(resId);
           if (index > -1) {
             this.selectedResources.splice(index, 1);
           } else {
             this.selectedResources.push(resId);
           }
         };
         this.activateSelected = function(){
           console.log("Activate: ", this.selectedResources);
           this.selectedResources = [];
         };
         this.deleteSelected = function(){
           if (!confirm("Are you sure you want to delete this resource(s)?")) {
             return;
           }
           for (var index = 0; index < this.selectedResources.length; index++) {
             this.deleteResource(this.selectedResources[index]);
           }
           this.selectedResources = [];
         };
       })
       .controller('ResActCtrl', function(resFactory){
         this.activate = function(resId){
           console.log(resId);
           history.back();
         };
         this.delete = function(resId){
         };
       })
       .controller('TimingsCtrl', function($routeParams, resFactory) {
         this.res = {};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         if(this.resId){
           resFactory.call('GetTPTiming', {TimingId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.call('SetTPTiming', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('DestinationsCtrl', function($routeParams, resFactory) {
         this.res = {};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         if(this.resId){
           resFactory.call('GetTPDestination', {DestinationId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           if(angular.isString(this.res.Prefixes)) {
             this.res.Prefixes = this.res.Prefixes.split(",");
           }
           resFactory.call('SetTPDestination', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('RatesCtrl', function($routeParams, resFactory) {
         this.res = {RateSlots:[{}]};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         if(this.resId){
           resFactory.call('GetTPRate', {RateId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.call('SetTPRate', this.res).success(function(data){resFactory.setMessage(data);});
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
         resFactory.call('GetTPDestinationIds', {ItemsPerPage:10, SearchTerm:ctrl.destSearchTerm}).success(function(data) {ctrl.destIds.push.apply(ctrl.destIds, data);});
         resFactory.call('GetTPRateIds', {ItemsPerPage:10, SearchTerm:ctrl.rateSearchTerm}).success(function(data) {ctrl.rateIds = data;});

         if(this.resId){
           resFactory.call('GetTPDestinationRate', {DestinationRateId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.call('SetTPDestinationRate', this.res).success(function(data){resFactory.setMessage(data);});
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
         resFactory.call('GetTPDestinationRateIds', {ItemsPerPage:10, SearchTerm:ctrl.destRateSearchTerm}).success(function(data) {ctrl.destRatesIds = data;});
         resFactory.call('GetTPTimingIds', {ItemsPerPage:10, SearchTerm:ctrl.timingSearchTerm}).success(function(data) {ctrl.tmIds = data;});

         if(this.resId){
           resFactory.call('GetTPRatingPlan', {RatingPlanId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.call('SetTPRatingPlan', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('RatingProfilesCtrl', function($routeParams, resFactory) {
         this.res = {RatingPlanActivations:[{}]};
         this.resId = $routeParams.res_id;
         this.rpSearchTerm = '';
         var ctrl = this;
         resFactory.call('GetTPRatingPlanIds', {ItemsPerPage:10, SearchTerm:ctrl.rpSearchTerm}).success(function(data) {ctrl.rPlans = data;});

         if(this.resId){
           resFactory.call('GetTPRatingProfiles', {RatingProfilesId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.call('SetTPRatingProfile', this.res).success(function(data){resFactory.setMessage(data);});
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
           resFactory.call('GetTPCdrStats', {CdrStatsId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.call('SetTPCdrStats', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('ActionsCtrl', function($routeParams, resFactory) {
         this.res = {Actions:[{}]};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         if(this.resId){
           resFactory.call('GetTPActions', {ActionsId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.call('SetTPActions', this.res).success(function(data){resFactory.setMessage(data);});
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
         resFactory.call('GetTPActionIds', {ItemsPerPage:10, SearchTerm:ctrl.actSearchTerm}).success(function(data) {ctrl.actIds = data;});
         resFactory.call('GetTPTimingIds', {ItemsPerPage:10, SearchTerm:ctrl.timingSearchTerm}).success(function(data) {ctrl.tmIds = data;});

         if(this.resId){
           resFactory.call('GetTPActionPlan', {Id: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.call('SetTPActionPlan', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('ActionTriggersCtrl', function($routeParams, resFactory) {
         this.res = {ActionTriggers:[{}]};
         this.resId = $routeParams.res_id;
         this.actIds = [];
         this.actSearchTerm = '';
         var ctrl = this;
         resFactory.call('GetTPActionIds', {ItemsPerPage:10, SearchTerm:ctrl.actSearchTerm}).success(function(data) {ctrl.actIds = data;});

         if(this.resId){
           resFactory.call('GetTPActionTriggers', {ActionTriggersId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.call('SetTPActionTriggers', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('AccountActionsCtrl', function($routeParams, resFactory) {
         this.res = {};
         this.resId = $routeParams.res_id;
         this.actSearchTerm = '';
         this.actTrigSearchTerm = '';
         var ctrl = this;
         resFactory.call('GetTPActionPlanIds', {ItemsPerPage:10, SearchTerm:ctrl.actSearchTerm}).success(function(data) {ctrl.actPlans = data;});
         resFactory.call('GetTPActionTriggerIds', {ItemsPerPage:10, SearchTerm:ctrl.actTrigSearchTerm}).success(function(data) {ctrl.actTriggers = data;});

         if(this.resId){
           resFactory.call('GetTPAccountActions', {AccountActionsId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.call('SetTPAccountActions', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('SharedGroupsCtrl', function($routeParams, resFactory) {
         this.res = {SharedGroups:[{}]};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         if(this.resId){
           resFactory.call('GetTPSharedGroups', {SharedGroupsId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.call('SetTPSharedGroups', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('DerivedChargersCtrl', function($routeParams, resFactory) {
         this.res = {DerivedChargers:[{}]};
         this.resId = $routeParams.res_id;
         var ctrl = this;

         if(this.resId){
           resFactory.call('GetTPDerivedChargers', {DerivedChargersId: this.resId}).success(function(data) {ctrl.res = data;});
         } else {
           this.showId = true;
         }

         this.saveResource = function(){
           resFactory.call('SetTPDerivedChargers', this.res).success(function(data){resFactory.setMessage(data);});
           history.back();
         };
       })
       .controller('ImportCtrl', function($routeParams, $location, resFactory){
         if ($routeParams.message) {
           $location.path('/import');
           resFactory.setMessage(atob($routeParams.message));
         }
       })
       .controller('ExportCtrl', function($routeParams, $location, resFactory){
         if ($routeParams.message) {
           $location.path('/export');
           resFactory.setMessage(atob($routeParams.message));
         }
       })
       .controller('ActivationCtrl', function($routeParams, resFactory){
         this.res = $routeParams.res;
         this.resId = $routeParams.res_id;
         if (!this.resId){}
         switch (this.res) {
           case "dt":
             resFactory.call('LoadDestination', {DestinationId:"*any"}).success(function(data){resFactory.setMessage(data);});
             break;
           case "rp":
             resFactory.call('LoadRatingPlan', {RatingPlanId:"*any"}).success(function(data){resFactory.setMessage(data);});
             break;
           case "rpf":
             resFactory.call('LoadRatingProfile', {LoadId: "*any", Tenant: "*any", Category: "*any", Direction: "*any", Subject: "*any"}).success(function(data){resFactory.setMessage(data);});
             break;
           case "aa":
             resFactory.call('LoadAccountActions', {LoadId: "*any", Tenant: "*any", Account: "*any", Direction: "*any"}).success(function(data){resFactory.setMessage(data);});
             break;
           case "all":
             var combinedMessage = "";
             resFactory.call('LoadRatingPlan', {RatingPlanId:"*any"}).success(function(data){combinedMessage += data});
             resFactory.call('LoadRatingProfile', {LoadId: "*any", Tenant: "*any", Category: "*any", Direction: "*any", Subject: "*any"}).success(function(data){combinedMessage += "<br>\n" + data});
             resFactory.call('LoadAccountActions', {LoadId: "*any", Tenant: "*any", Account: "*any", Direction: "*any"}).success(function(data){
               combinedMessage += "<br>\n" + data;
               resFactory.setMessage(combinedMessage);
             });
             break;
         }
         history.back();
       });
