'use strict';

/* Directives */


angular.module('cgradminApp.directives', [])
       .directive('appVersion', ['version', function(version) {
         return function(scope, elm, attrs) {
           elm.text(version);
         };
       }])
       .directive('back', function() {
         return {
           restrict: 'E',
           replace: true,
           template: '<a href="" class="btn btn-default pull-right"><span class="glyphicon glyphicon-remove"></span> Cancel</a>',
           link: function(scope, element) {
             $(element).on('click', function() {
               history.back();
             });
           }
         };
       });
