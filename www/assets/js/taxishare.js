// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
app = angular.module('starter', ['ionic', 'starter.services','ngCordova','btford.socket-io']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

.state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
  })
  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    controller: 'AppCtrl',
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.users', {
      url: '/users',
      views: {
        'tab-users': {
          templateUrl: 'templates/tab-users.html',
          controller: 'UsersCtrl'
        }
      }
    })
    .state('tab.users-detail', {
      url: '/users/:userId',
      views: {
        'tab-users': {
          templateUrl: 'templates/user-detail.html',
          controller: 'UserDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});

app.controller('AccountCtrl', function ($scope) {
            $scope.settings = {
                enableFriends: true
            };
        });
app.controller('AppCtrl', function ($scope, $rootScope, chatSocket,$log, messageFormatter,$state, $cordovaGeolocation, Users) {
    _initController = function () {
        $rootScope.mensajeria={};
        $rootScope.mensajeria.messageLog=[];
        $rootScope.mensajeria.newMessage=0;
        $rootScope.mensajeria.message = '';
        if (!window.localStorage.userTaxi && !$rootScope.user) {
            $state.go('login');
        } else if(!$rootScope.user) {
            $rootScope.user = Users.get({_id: localStorage.userTaxi},function () {
                _updatePosition();
                _initListen();
            });
        }else{
                _initListen();
        }
    }
    _updatePosition = function () {
        $cordovaGeolocation.getCurrentPosition().then(function (pos) {
            $rootScope.user.location = [pos.coords.longitude, pos.coords.latitude]
            Users.update({_id: $rootScope.user._id}, $rootScope.user);
        });
    }
    _initListen = function () {
        chatSocket.on('broadcast:' + $rootScope.user.email, function (data) {
            if (!data.payload) {
                $log.error('invalid message',
                        'data', JSON.stringify(data));
                return;
            }
            $rootScope.$apply(function () {
                $rootScope.newMessage += 1;
                $rootScope.mensajeria.messageLog.push(messageFormatter(
                        new Date(), data.source,
                        data.payload));
            });
        });
    }
    _initController();

})

app.controller('DashCtrl', function ($scope, $rootScope, $log, chatSocket, messageFormatter) {
    
});

app.controller('loginCtrl', function ($scope, $rootScope, Users, $state, $ionicPopup) {
    $scope.data = {email: '', password: ''}
    $scope.login = function (form) {
        if (form.$valid) {
            Users.login($scope.data).$promise.then(function (user) {
                localStorage.setItem('userTaxi',user._id);
                $state.go('tab.dash')
            }, function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: error.data
                });
            });
        }
    }
})
app.controller('UserDetailCtrl', function ($scope, $stateParams, Users,$log,chatSocket,$rootScope) {
    _loadUser = function () {
        $scope.user = {};
        Users.get({_id: $stateParams.userId}).$promise.then(function (ActualUser) {
            $scope.ActualUser = ActualUser;
        });
        console.log($scope);
    }
    $scope.sendMessage = function (message,to) {
        chatSocket.emit('message', $rootScope.user.email, $rootScope.mensajeria.message,to);
        $rootScope.mensajeria.message = '';
    };
    _loadUser();
})
app.controller('UsersCtrl', function ($scope, $cordovaGeolocation, Users) {
    $scope.loadUsers = function () {
        $scope.users = [];
        $cordovaGeolocation.getCurrentPosition().then(function(pos){
            var latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

            Users.getNear({lat: pos.coords.latitude, lng: pos.coords.longitude}).$promise.then(function (results) {
                $scope.users = results;
                results.forEach(function (user) {
                    var marker = new google.maps.Marker({
                        position: {lat: user.location[1], lng: user.location[0]},
                        label: user.name,
                        map: $scope.map,
                        url: '#/tab/users/' + user._id
                    });
                    google.maps.event.addListener(marker, 'click', function () {
                        window.location.href = this.url;
                    });
                });
            });
        });
    };
    $scope.remove = function (user) {
        console.debug(user);
        return user.$delete().then($scope.loadUsers);
    };
    $scope.loadUsers();
});
angular.module('starter.services', ['ngResource'])
 .factory('Users', [
    '$resource', function($resource) {
      return $resource('http://localhost:9615/api/users/:_id', {
        _id: '@_id'
      },{
          'update': { method:'PUT' },
      getNear:{
          method:'get',
          url:'http://localhost:9615/api/users/near/:lat/:lng',
          params: {lat:'@lat',lng:'@lng'},
          isArray: true
      },
      login:{
          method:'get',
          url:'http://localhost:9615/api/users/login/:email/:password',
          params: {email:'@email',password:'@password'},
          isArray: false
      }
  });
    }
  ]
  
      );
//.factory('Users', function() {
//  // Might use a resource here that returns a JSON array
//
//  // Some fake testing data
//  '$resource', function($resource) {
//      return $resource('http://blog.agresebe.com/api/users/:username', {
//        username: '@username'
//      });
//        }
//
//  return {
//    all: function() {
//        return $resource.query().$promise.then(function(results) {
//          return users = results;
//        });
//    },
//    remove: function(user) {
//      users.splice(users.indexOf(user), 1);
//    },
//    get: function(userId) {
//      for (var i = 0; i < users.length; i++) {
//        if (users[i].id === parseInt(userId)) {
//          return users[i];
//        }
//      }
//      return null;
//    }
//  };
//});

app.factory('chatSocket', function (socketFactory,$rootScope) {
//    var myIoSocket = io.connect('http://localhost:9615');

    return socketFactory(
            {
                ioSocket:io.connect('http://localhost:9615'),
        prefix:'broadcast'
    }
            )
//    socket.forward('broadcast:'+$rootScope.user);
//    return socket;
});
app.value('messageFormatter', function (date, nick, message) {
    return {hora:date.toLocaleTimeString(),nick:nick,msg:message};
});