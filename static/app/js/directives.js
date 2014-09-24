'use strict';

/* Directives */


angular.module('cgradminApp.directives', [])
       .directive('appVersion', ['version', function(version) {
         return function(scope, elm, attrs) {
           elm.text(version);
         };
       }])
       .directive('breadcrumbs', function($location, breadcrumbsFactory){
         return {
           restrict: 'E',
           replace: true,
           scope: {
             label: "=",
             reset: "="
           },
           template: '<ol class="breadcrumb"><li ng-repeat="c in crumbs" ng-class="{\'active\':$last}">'
           + '<a ng-if="!$last" href="#{{c.path}}">{{c.label}}</a>'
           + '<span ng-if="$last">{{c.label}}</span>'
           + '</li></ol>',
           link: function(scope){
             if (scope.reset) {
               breadcrumbsFactory.reset();
             }
             breadcrumbsFactory.add({path: $location.path(), label: scope.label});
             scope.crumbs = [];
             var i = 0;
             for(; i < breadcrumbsFactory.crumbs.length; i++){
               scope.crumbs.push(JSON.parse(breadcrumbsFactory.crumbs[i]));
             }
           }
         };
       })
       .directive('back', function() {
         return {
           restrict: 'E',
           replace: true,
           template: '<a href="" class="btn btn-default pull-right"><span class="glyphicon glyphicon-remove"></span> Cancel</a>',
           link: function(scope, element) {
             element.bind('click', function(){history.back();});
           }
         };
       });

