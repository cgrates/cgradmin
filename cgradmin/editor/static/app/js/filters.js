'use strict';

/* Filters */

angular.module('cgradminApp.filters', [])
       .filter('interpolate', ['version', function(version) {
         return function(text) {
           return String(text).replace(/\%VERSION\%/mg, version);
         };
       }])
       .filter('titlecase', function() {
         return function(str) {
           return (str == undefined || str === null) ? '' : str.replace(/_|-/, ' ').replace(/\w\S*/g, function(txt){
             return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
           });
         }
       });
