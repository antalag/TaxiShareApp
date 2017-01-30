//import {Geolocation} from 'ionic-native';

angular.module('starter.controllers', ['ngCordova'])

        .controller('DashCtrl', function ($scope) {})
        .controller('loginCtrl', function ($scope) {
            $scope.data={email:'',password:''}
            $scope.login = function(){
                console.log($scope.data)
            }
        })

        .controller('UsersCtrl', function ($scope, $cordovaGeolocation, Users) {
            $scope.users = [];
            $scope.loadUsers = function () {
                $cordovaGeolocation.getCurrentPosition().then(pos => {
                    var latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

                    var mapOptions = {
                        center: latLng,
                        zoom: 15,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };

                    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

                    Users.getNear({lat: pos.coords.latitude, lng: pos.coords.longitude}).$promise.then(function (results) {
                        $scope.users = results;
                        results.forEach(function(user){
                            var marker = new google.maps.Marker({
                                position: { lat: user.location[1], lng: user.location[0] },
                                label: user.name,
                                map: $scope.map,
                                url:'#/tab/users/'+user._id
                            });
                            google.maps.event.addListener(marker, 'click', function() {
                                window.location.href = this.url;
                            });
                        });
                    });
                });
            };
//  $scope.users = Users.all();
            $scope.remove = function (user) {
                console.debug(user)
                return user.$delete().then($scope.loadUsers);
            };
            return $scope.loadUsers();
        })

        .controller('UserDetailCtrl', function ($scope, $stateParams, Users) {
            $scope.loadUser = function () {
                $scope.user = {};
                return Users.get({_id: $stateParams.userId}).$promise.then(function (user) {
                    return $scope.user = user;
                });
            }
            return $scope.loadUser();
        })

        .controller('AccountCtrl', function ($scope) {
            $scope.settings = {
                enableFriends: true
            };
        });
