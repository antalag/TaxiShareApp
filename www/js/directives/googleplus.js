'use strict';

/*
 * angular-google-plus-directive v0.0.1
 * ♡ CopyHeart 2013 by Jerad Bitner http://jeradbitner.com
 * Copying is an act of love. Please copy.
 */

angular.module('directive.g+signin', []).
  directive('googlePlusSignin', ['$window', function ($window) {
    var ending = /\.apps\.googleusercontent\.com$/;

    return {
      restrict: 'E',
      transclude: true,
      template: '<button type="button" class="button button-block button-calm"></button>',
      replace: true,
      link: function (scope, element, attrs, ctrl, linker) {
        attrs.clientid += (ending.test(attrs.clientid) ? '' : '.apps.googleusercontent.com');

//        attrs.$set('data-clientid', attrs.clientid);
        attrs.$set('theme', attrs.theme);

        // Some default values, based on prior versions of this directive
        var defaults = {
          onsuccess:'signinSucces',
          onfaliure:'signinFaliure',
          scope: 'profile email',
          height: 'standard',
          width: 'wide',
        };

//        defaults.clientid = attrs.clientid;
        defaults.theme = attrs.theme;

        // Overwrite default values if explicitly set
        angular.forEach(Object.getOwnPropertyNames(defaults), function(propName) {
          if (attrs.hasOwnProperty(propName)) {
            defaults[propName] = attrs[propName];
          }
        });

        // Default language
        // Supported languages: https://developers.google.com/+/web/api/supported-languages
        attrs.$observe('language', function(value){
          $window.___gcfg = {
            lang: value ? value : 'en'
          };
        });
        
        // Asynchronously load the G+ SDK.
//        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;po.defer = true;
//        po.src = 'https://apis.google.com/js/platform.js';
//        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
        var me = document.createElement('meta'); me.name = 'google-signin-client_id'; me.content = attrs.clientid;
        var m = document.getElementsByTagName('meta')[0]; m.parentNode.insertBefore(me, m);

        linker(function(el, tScope){
                            console.log(defaults);
//          po.onload = function() {
//            if (el.length) {
//              element.append(el);
//            }
            gapi.signin2.render(element[0], defaults);
//          };
        });
      }
    }
}]).
  run(['$window','$rootScope',function($window, $rootScope) {
    $window.signinSucces = function (authResult) {
        $rootScope.$broadcast('event:google-plus-signin-success', authResult);
    }
    $window.signinFaliure = function (error) {
        $rootScope.$broadcast('event:google-plus-signin-failure', error);
    }; 
}]);
