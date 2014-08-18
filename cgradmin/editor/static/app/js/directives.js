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
            template: '<div><a href="" class="btn btn-default pull-right">Back</a></div>',
            link: function(scope, element) {
                $(element).on('click', function() {
                    history.back();
                });
            }
        };
    });
