!function t(r,e,a){function l(s,n){if(!e[s]){if(!r[s]){var u="function"==typeof require&&require;if(!n&&u)return u(s,!0);if(o)return o(s,!0);var i=new Error("Cannot find module '"+s+"'");throw i.code="MODULE_NOT_FOUND",i}var c=e[s]={exports:{}};r[s][0].call(c.exports,function(t){var e=r[s][1][t];return l(e?e:t)},c,c.exports,t,r,e,a)}return e[s].exports}for(var o="function"==typeof require&&require,s=0;s<a.length;s++)l(a[s]);return l}({1:[function(t,r,e){"use strict";angular.module("starter",["ionic","starter.controllers","starter.services"]).run(function(t){t.ready(function(){window.cordova&&window.cordova.plugins&&window.cordova.plugins.Keyboard&&(cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0),cordova.plugins.Keyboard.disableScroll(!0)),window.StatusBar&&StatusBar.styleDefault()})}).config(function(t,r){t.state("login",{url:"/login",templateUrl:"templates/login.html",controller:"loginCtrl"}).state("tab",{url:"/tab","abstract":!0,templateUrl:"templates/tabs.html"}).state("tab.dash",{url:"/dash",views:{"tab-dash":{templateUrl:"templates/tab-dash.html",controller:"DashCtrl"}}}).state("tab.users",{url:"/users",views:{"tab-users":{templateUrl:"templates/tab-users.html",controller:"UsersCtrl"}}}).state("tab.users-detail",{url:"/users/:userId",views:{"tab-users":{templateUrl:"templates/user-detail.html",controller:"UserDetailCtrl"}}}).state("tab.account",{url:"/account",views:{"tab-account":{templateUrl:"templates/tab-account.html",controller:"AccountCtrl"}}}),r.otherwise("/login")})},{}]},{},[1]);
//# sourceMappingURL=bundle.js.map
