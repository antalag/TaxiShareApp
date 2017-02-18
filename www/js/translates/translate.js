var app = angular.module('trans', ['pascalprecht.translate']);

app.config(function ($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix: 'js/translates/languages/',
        suffix: '.json'
      });

var locale = "es";

if(window.localStorage['language']){
    locale = window.localStorage['language'];
}else{
    if(window.navigator.language.substring(0,2) == "es"){
        locale = "es";
    } else if(window.navigator.language.substring(0,2) == "en"){
        locale = "en";
    }
}

$translateProvider.preferredLanguage(locale);
moment.locale(locale);
window.localStorage['language'] = locale;

});

app.controller('Ctrl', function ($scope, $translate) {
  $scope.changeLanguage = function (key) {
    $translate.use(key);
  };
});